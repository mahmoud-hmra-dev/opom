import {ITaskStatus} from "@interfaces/task-status";

export interface ITaskStatusCreateRequest extends ITaskStatus {
  status_order?: string[];
  task_order?: string[];
  from_index?: number;
  to_index?: number;
  project_id?: string;
}
