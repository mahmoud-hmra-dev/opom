import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UtilsService} from "@services/utils.service";
import {TaskViewService} from "../task-view.service";
import {TaskViewCommentsComponent} from "../task-view-comments/task-view-comments.component";
import { KpiService } from '@services/kpi.service';
import { AuthService } from '@services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

interface KpiAssignment {
  id: string;
  kpi_id: string;
  kpi_name: string;
  target_value: number;
  current_value: number;
  unit: string;
  status: string;
}

@Component({
  selector: 'worklenz-task-view-info',
  templateUrl: './task-view-info.component.html',
  styleUrls: ['./task-view-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskViewInfoComponent {
  @ViewChild("commentsView", {static: false}) commentsView!: TaskViewCommentsComponent;
  @Output()
  commentsInputFocused = false;

  constructor(
    private readonly route: ActivatedRoute,
    public readonly utils: UtilsService,
    private message: NzMessageService,
    public readonly service: TaskViewService,
    private kpiService: KpiService,
    private auth : AuthService
  ) {
    this.getKpis();
  }

  @Output() kpiChanged = new EventEmitter<{ selectedKpi: string }>();
  @Input() kpis: any[] = [];
  @Input('selectedKpi') selectedKpi!: string | null;
  @Input('disabled') disabled: boolean = false;

  currentValue!: number;
  availableKpis: any[] = [];
  taskKpis: KpiAssignment[] = [];

  ngOnInit() {
    this.loadSavedKpiAssignment();
    this.loadTaskKpis();
  }
  //


loadSavedKpiAssignment() {
  const taskId = this.service.model?.task?.id;
  const userID = this.auth.getCurrentSession()?.id ?? "";
  if (taskId) {
    this.kpiService.getUserKpiAssignmentsForTask(taskId,userID).subscribe(
      (assignments: any[]) => {
        if (assignments.length > 0) {
          this.selectedKpi = assignments[0].kpi_id;
          this.currentValue = assignments[0].current_value;
        }
      }
    );
  }
}

loadKpiAssignment() {
  const taskId = this.service.model?.task?.id;
  const kpiId = this.selectedKpi;
  const userID = this.auth.getCurrentSession()?.id ?? "";

  if (taskId && kpiId) {
    this.kpiService.getUserKpiAssignmentsForTask(taskId,userID).subscribe(
      (assignments: any[]) => {
        const existingAssignment = assignments.find(a => a.kpi_id === kpiId);
        if (existingAssignment) {
          this.currentValue = existingAssignment.current_value;
        } else {
          this.currentValue = 0;
        }
      }
    );
  }
}

saveKpiAssignment() {
  if (!this.selectedKpi || !this.currentValue) return;

  const taskId = this.service.model?.task?.id ?? "";
  const kpiId = this.selectedKpi;
  const projectId = this.service.model?.task?.project_id;
  const team_member_id = this.auth.getCurrentSession()?.team_member_id;

  const kpiAssignmentData = {
    kpi_id: kpiId,
    team_member_id,
    task_id: taskId,
    project_id: projectId,
    current_value: this.currentValue,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '2025-12-31'
  };
  const userID = this.auth.getCurrentSession()?.id ?? "";
  this.kpiService.getUserKpiAssignmentsForTask(taskId,userID).subscribe(
    (response: any) => {
      // Safely convert response to array
      const assignments = this.normalizeResponseToArray(response);

      const existingAssignment = assignments.find((a: any) => a.kpi_id === kpiId);

      if (existingAssignment) {
        this.updateExistingAssignment(existingAssignment.id, kpiAssignmentData);
      } else {
        this.createNewAssignment(kpiAssignmentData);
      }
    },
    (error: any) => {
      console.error('Error:', error);
    }
  );
}

// Helper function to ensure we always get an array
private normalizeResponseToArray(response: any): any[] {
  if (Array.isArray(response)) return response;
  if (response?.body && Array.isArray(response.body)) return response.body;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
}

private updateExistingAssignment(id: string, data: any) {
  this.kpiService.updateKpiAssignment(id, data).subscribe(
    (response: any) => {
      this.message.success('KPI updated successfully');
    },
    (error: any) => {

    }
  );
}

private createNewAssignment(data: any) {
  this.kpiService.createKpiAssignment(data).subscribe(
    (response: any) => {

      this.message.success('KPI created successfully');
    },
    (error: any) => {

    }
  );
}


  //



  validateCurrentValue() {
    const targetValue = this.selectedKpi ? this.getKPIbyId(this.selectedKpi).target_value : 0;
    if (this.currentValue > targetValue) {
      // يمكنك هنا إضافة أي منطق إضافي تريده
      console.warn('Current value exceeds target value!');
    }
  }

  onKpiChanged(event: { selectedKpi: string }) {
    console.log('Selected KPI:', event.selectedKpi);
    this.selectedKpi = event.selectedKpi;
  }



  getKpis(): void {
    const userID = this.auth.getCurrentSession()?.id ?? "";
    this.kpiService.getByUserId(userID).subscribe(
      (data) => {
        this.kpis = data.body;
        this.updateAvailableKpis();
      }
    );
  }

  getKPIbyId(id: string) {
    const kpi = this.kpis.find(kpi => kpi.id === id);
    return kpi ? kpi : null;  // Return the found KPI or null if not found
  }




  onKpiChange(value: any) {
    this.selectedKpi = value;
    this.emitSelection();

    // Ensure `this.service.model.task` exists and all necessary values are available
    const taskId = this.service.model?.task?.id;
    const kpiId = value; // The selected KPI ID
    const projectId = this.service.model?.task?.project_id;
    const team_member_id = this.auth.getCurrentSession()?.team_member_id;
    const currentValue = this.currentValue;

    const kpiAssignmentData = {
      kpi_id: kpiId,
      team_member_id,
      task_id: taskId,
      project_id: projectId,
      current_value: currentValue,
      start_date: '2025-01-01',
      end_date: '2025-12-31'
    };

    this.kpiService.createKpiAssignment(kpiAssignmentData).subscribe(
      response => {
        console.log('KPI Assignment Created:', response.body);
      },
      error => {
        console.error('Error creating KPI Assignment:', error);
      }
    );

    // Reset current value after sending the data
    this.currentValue = 0;
  }


  private emitSelection() {
    if (this.selectedKpi) {
      this.kpiChanged.emit({ selectedKpi: this.selectedKpi });
    }
  }

  isEditTask() {
    return !!this.service.model.task?.id;
  }

  isTaskAvailable() {
    return !!this.service.model.task;
  }

  getAttachmentsHeader() {
    const count = this.service.model.task?.attachments_count || 0;
    return `Attachments (${count})`;
  }

  isSubTask() {
    return !!this.service.model.task?.is_sub_task;
  }

  onCommentsInputFocus(focused: boolean) {
    this.commentsInputFocused = focused;
    setTimeout(() => {
      this.commentsView.scrollIntoView();
    }, 100);
  }

  refreshSubTasks(event: MouseEvent) {
    event.stopPropagation();
    this.service.emitSubTasksRefresh();
  }

  updateAvailableKpis() {
    this.availableKpis = this.kpis.filter(kpi =>
      !this.taskKpis.some(taskKpi => taskKpi.kpi_id === kpi.id)
    );
  }

  loadTaskKpis() {
    const taskId = this.service.model?.task?.id;
    const userID = this.auth.getCurrentSession()?.id ?? "";
    if (taskId) {
      this.kpiService.getUserKpiAssignmentsForTask(taskId, userID).subscribe(
        (assignments: any[]) => {
          this.taskKpis = assignments.map(assignment => ({
            id: assignment.id,
            kpi_id: assignment.kpi_id,
            kpi_name: assignment.kpi_name,
            target_value: assignment.target_value,
            current_value: assignment.current_value,
            unit: assignment.unit,
            status: this.calculateKpiStatus(assignment)
          }));
          this.updateAvailableKpis();
        }
      );
    }
  }

  addKpiToTask() {
    if (!this.selectedKpi) return;

    const taskId = this.service.model?.task?.id;
    const kpiId = this.selectedKpi;
    const projectId = this.service.model?.task?.project_id;
    const team_member_id = this.auth.getCurrentSession()?.team_member_id;

    const kpiAssignmentData = {
      kpi_id: kpiId,
      team_member_id,
      task_id: taskId,
      project_id: projectId,
      current_value: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '2025-12-31'
    };

    this.kpiService.createKpiAssignment(kpiAssignmentData).subscribe(
      (response: any) => {
        this.message.success('KPI added successfully');
        this.loadTaskKpis();
        this.selectedKpi = null;
      },
      (error: any) => {
        this.message.error('Error adding KPI');
      }
    );
  }

  removeKpiFromTask(kpi: KpiAssignment) {
    this.kpiService.deleteKpiAssignment(kpi.id).subscribe(
      () => {
        this.message.success('KPI removed successfully');
        this.loadTaskKpis();
      },
      (error: any) => {
        this.message.error('Error removing KPI');
      }
    );
  }

  validateKpiValue(kpi: KpiAssignment) {
    if (kpi.current_value > kpi.target_value) {
      kpi.current_value = kpi.target_value;
    }
  }

  updateKpiValue(kpi: KpiAssignment) {
    const data = {
      current_value: kpi.current_value
    };

    this.kpiService.updateKpiAssignment(kpi.id, data).subscribe(
      () => {
        kpi.status = this.calculateKpiStatus(kpi);
        this.message.success('KPI value updated successfully');
      },
      (error: any) => {
        this.message.error('Error updating KPI value');
      }
    );
  }

  calculateKpiStatus(kpi: KpiAssignment): string {
    const percentage = (kpi.current_value / kpi.target_value) * 100;
    if (percentage >= 100) return 'Completed';
    if (percentage >= 80) return 'On Track';
    if (percentage >= 50) return 'At Risk';
    return 'Off Track';
  }

  getKpiStatus(kpi: KpiAssignment): string {
    return kpi.status;
  }

  getKpiStatusColor(kpi: KpiAssignment): string {
    switch (kpi.status) {
      case 'Completed':
        return 'success';
      case 'On Track':
        return 'processing';
      case 'At Risk':
        return 'warning';
      case 'Off Track':
        return 'error';
      default:
        return 'default';
    }
  }
}
