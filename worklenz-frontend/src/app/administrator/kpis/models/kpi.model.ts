export interface KpiReport {
    id: string;
    kpi_id: string;
    kpi_name: string;
    kpi_description: string;
    target_value: string;
    current_value: string;
    unit: string;
    completion_percentage: string;
    status: string;
    team_member_id: string;
    member_name: string;
    member_avatar: string | null;
    task_id: string;
    task_name: string;
    project_id: string;
    project_name: string;
    start_date: string;
    end_date: string;
}

export interface KpiQueryParams {
    page: number;
    pageSize: number;
    startDate?: string;
    endDate?: string;
    members?: string[];
    projects?: string[];
    kpis?: string[];
    searchText?: string;
}

export interface KpiPaginatedResponse {
    data: KpiReport[];
    total: number;
    page: number;
    pageSize: number;
}
