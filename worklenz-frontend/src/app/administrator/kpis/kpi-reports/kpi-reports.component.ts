import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { KpiService } from '@services/kpi.service';
import { KpiReport, KpiQueryParams } from '../models/kpi.model';

@Component({
    selector: 'app-kpi-reports',
    templateUrl: './kpi-reports.component.html',
    styleUrls: ['./kpi-reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiReportsComponent implements OnInit, OnDestroy {
    // Loading state
    loading = false;

    // Table data
    kpis: KpiReport[] = [];
    total = 0;

    // Pagination
    pageIndex = 1;
    pageSize = 10;
    pageSizes = [10, 20, 50, 100];

    // Filters
    dateRange: Date[] = [];
    searchText = '';
    selectedMembers: string[] = [];
    selectedProjects: string[] = [];
    selectedKpis: string[] = [];

    // Filter options
    members: Array<{ id: string; name: string }> = [];
    projects: Array<{ id: string; name: string }> = [];
    kpiNames: Array<{ id: string; name: string }> = [];

    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();

    constructor(
        private kpiService: KpiService,
        private notification: NzNotificationService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.setupSearch();
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupSearch(): void {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.pageIndex = 1; // Reset to first page on search
            this.loadData();
        });
    }

    onSearch(): void {
        this.searchSubject.next(this.searchText);
    }

    loadData(): void {
        this.loading = true;

        const params: KpiQueryParams = {
            page: this.pageIndex,
            pageSize: this.pageSize,
            startDate: this.dateRange[0] ? this.formatDate(this.dateRange[0]) : undefined,
            endDate: this.dateRange[1] ? this.formatDate(this.dateRange[1]) : undefined,
            members: this.selectedMembers,
            projects: this.selectedProjects,
            kpis: this.selectedKpis,
            searchText: this.searchText
        };

        this.kpiService.getKpiReport(params)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.kpis = response.data;
                    this.total = response.total;
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    console.error('Failed to load KPIs:', error);
                    this.notification.error('Error', 'Failed to load KPI data');
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        this.pageIndex = params.pageIndex;
        this.pageSize = params.pageSize;
        this.loadData();
    }

    onFiltersChange(): void {
        this.pageIndex = 1; // Reset to first page when filters change
        this.loadData();
    }

    exportToExcel(): void {
        if (!this.dateRange || this.dateRange.length < 2) {
            this.notification.warning('Warning', 'Please select a date range first');
            return;
        }

        const params: KpiQueryParams = {
            page: 1,
            pageSize: 1000000, // Large number to get all records
            startDate: this.formatDate(this.dateRange[0]),
            endDate: this.formatDate(this.dateRange[1]),
            members: this.selectedMembers,
            projects: this.selectedProjects,
            kpis: this.selectedKpis,
            searchText: this.searchText
        };

        this.kpiService.exportKpiReport(params)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `KPI_Report_${new Date().toISOString()}.xlsx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                },
                error: (error) => {
                    console.error('Failed to export report:', error);
                    this.notification.error('Error', 'Failed to export KPI report');
                }
            });
    }

    getStatusColor(status: string): string {
        if (!status) return 'default';
        
        switch (status.toLowerCase()) {
            case 'completed':
            case 'on track':
                return 'success';
            case 'at risk':
                return 'warning';
            case 'off track':
                return 'error';
            default:
                return 'default';
        }
    }

    getCompletionPercentage(completion: string): number {
        return parseFloat(completion) || 0;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
