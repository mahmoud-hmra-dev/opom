import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KpiQueryParams, KpiPaginatedResponse } from '../administrator/kpis/models/kpi.model';

@Injectable({
    providedIn: 'root'
})
export class KpiService {
    private readonly baseUrl = '/api/kpi-assignments';

    constructor(private http: HttpClient) {}

    getKpiReport(params: KpiQueryParams): Observable<KpiPaginatedResponse> {
        let httpParams = new HttpParams()
            .set('page', params.page.toString())
            .set('pageSize', params.pageSize.toString());

        if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
        if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
        if (params.members?.length) httpParams = httpParams.set('members', params.members.join(','));
        if (params.projects?.length) httpParams = httpParams.set('projects', params.projects.join(','));
        if (params.kpis?.length) httpParams = httpParams.set('kpis', params.kpis.join(','));
        if (params.searchText) httpParams = httpParams.set('searchText', params.searchText);

        return this.http.get<KpiPaginatedResponse>(`${this.baseUrl}/reports/data`, { params: httpParams });
    }

    exportKpiReport(params: KpiQueryParams): Observable<Blob> {
        let httpParams = new HttpParams();
        if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
        if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
        if (params.members?.length) httpParams = httpParams.set('members', params.members.join(','));
        if (params.projects?.length) httpParams = httpParams.set('projects', params.projects.join(','));
        if (params.kpis?.length) httpParams = httpParams.set('kpis', params.kpis.join(','));
        if (params.searchText) httpParams = httpParams.set('searchText', params.searchText);

        return this.http.get(`${this.baseUrl}/reports/export`, {
            params: httpParams,
            responseType: 'blob'
        });
    }
}
