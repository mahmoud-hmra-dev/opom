export interface IKpiReportItem {
  id: string;
  kpi_id: string;
  kpi_name: string;
  kpi_description: string;
  target_value: number;
  current_value: number;
  unit: string;
  completion_percentage: number;
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

export interface IKpiReportResponse {
  data: IKpiReportItem[];
  total: number;
}
