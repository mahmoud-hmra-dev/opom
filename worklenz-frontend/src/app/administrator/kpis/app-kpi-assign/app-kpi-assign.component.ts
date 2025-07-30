import { Component , EventEmitter ,Output , Input } from '@angular/core';
import { TeamMembersApiService } from '@api/team-members-api.service';
import { ITeamMemberViewModel } from '@interfaces/api-models/team-members-get-response';
import { TaskListV2Service } from 'app/administrator/modules/task-list-v2/task-list-v2.service';

@Component({
  selector: 'worklenz-app-kpi-assign',
  templateUrl: './app-kpi-assign.component.html',
  styleUrls: ['./app-kpi-assign.component.scss']
})
export class AppKpiAssignComponent {
  @Output() assignChanged = new EventEmitter<{ responsible: string, accountable: string }>();
  members: ITeamMemberViewModel[] = [];
  @Input('selectedResponsible') selectedResponsible: string | null = null;
  @Input('selectedAccountable') selectedAccountable: string | null = null;

  @Input('disabled') disabled: boolean  = false;


  constructor(
    private service: TaskListV2Service,
    private teamMembersApiService : TeamMembersApiService
    ) { }

   async ngOnInit() {


    const res = await this.teamMembersApiService.getAll();
    this.members = res.body;
    console.log(this.members);
  }


  onResponsibleChange(value: any) {
    console.log(value);
    this.selectedResponsible = value;
    this.emitSelection();
  }

  onAccountableChange(value: any) {
    console.log(value);
    this.selectedAccountable = value;
    this.emitSelection();
  }

  private emitSelection() {
    if (this.selectedResponsible && this.selectedAccountable) {
      this.assignChanged.emit({
        responsible: this.selectedResponsible,
        accountable: this.selectedAccountable
      });
    }
  }
}
