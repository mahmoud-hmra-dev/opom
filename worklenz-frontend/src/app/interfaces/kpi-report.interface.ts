export interface IKpiReportItem {
  id: string;
  kpi_id: string;
  kpi_name: string;
  kpi_description: string;
  target_value: number;
  current_value: number;
  unit: string;
  completion_percentage: number;
  status: 'On Track' | 'At Risk' | 'Off Track';
  member_id: string;
  member_name: string;
  member_avatar: string | null;
  project_id: string;
  project_name: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface IKpiReportResponse {
  data: IKpiReportItem[];
  total: number;
}

export interface ITeam {
  id: string;
  name: string;
  selected: boolean;
}

export interface IProject {
  id: string;
  name: string;
  selected: boolean;
}
