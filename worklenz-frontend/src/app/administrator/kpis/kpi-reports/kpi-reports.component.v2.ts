import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { KpiService } from '@services/kpi.service';
import { KpiReport, KpiFilters } from '../models/kpi-filters.model';

@Component({
  selector: 'app-kpi-reports',
  templateUrl: './kpi-reports.component.html',
  styleUrls: ['./kpi-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiReportsComponent implements OnInit, OnDestroy {
  loading = false;
  isDurationLabelSelected = false;
  searchText = '';
  dateRange: Date[] = [];

  // Pagination
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  paginationSizes = [10, 20, 50, 100];

  // Data
  kpis: KpiReport[] = [];

  // Filters
  members: Array<{ id: string; name: string }> = [];
  projects: Array<{ id: string; name: string }> = [];
  kpiNames: Array<{ id: string; name: string }> = [];
  selectedMembers: string[] = [];
  selectedProjects: string[] = [];
  selectedKpis: string[] = [];

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private kpiService: KpiService,
    private notification: NzNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadKpis();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadKpis();
    });
  }

  public loadKpis(): void {
    this.loading = true;

    const filters: KpiFilters = {
      page: this.pageIndex,
      pageSize: this.pageSize,
      startDate: this.dateRange[0] ? this.formatDate(this.dateRange[0]) : undefined,
      endDate: this.dateRange[1] ? this.formatDate(this.dateRange[1]) : undefined,
      members: this.selectedMembers,
      projects: this.selectedProjects,
      kpis: this.selectedKpis,
      searchText: this.searchText
    };

    this.kpiService.getKpiReport(filters)
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

  onSearch(): void {
    this.searchSubject.next(this.searchText);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadKpis();
  }

  onDateRangeChange(): void {
    this.loadKpis();
  }

  onFiltersChange(): void {
    this.loadKpis();
  }

  exportToExcel(): void {
    if (!this.dateRange || this.dateRange.length < 2) {
      this.notification.warning('Warning', 'Please select a date range first');
      return;
    }

    const filters: KpiFilters = {
      page: 1,
      pageSize: 1000000, // Large number to get all records
      startDate: this.formatDate(this.dateRange[0]),
      endDate: this.formatDate(this.dateRange[1]),
      members: this.selectedMembers,
      projects: this.selectedProjects,
      kpis: this.selectedKpis,
      searchText: this.searchText
    };

    this.kpiService.exportKpiReport(filters)
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
    if (!status) {
      return 'default';
    }
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
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

  openKpiDetails(kpi: KpiReport): void {
    // Implement logic to open KPI details drawer
    console.log('Opening KPI details for:', kpi);
  }

  trackBy(_: number, item: KpiReport): string {
    return item.id;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
