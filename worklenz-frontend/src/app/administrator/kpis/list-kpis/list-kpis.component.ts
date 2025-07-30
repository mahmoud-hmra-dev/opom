import { Component, OnInit } from '@angular/core';
import { TeamMembersApiService } from '@api/team-members-api.service';
import { AuthService } from '@services/auth.service';
import { KpiService } from '@services/kpi.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'worklenz-list-kpis',
  templateUrl: './list-kpis.component.html',
  styleUrls: ['./list-kpis.component.scss']
})
export class ListKpisComponent implements OnInit {
  kpis: any[] = [];
  loading = false;
  teamMembersCache: { [key: string]: string } = {};

  constructor(
    private kpiService: KpiService,
    private message: NzMessageService,
    private teamMembersApiService: TeamMembersApiService,
    private auth :AuthService
  ) { }

  ngOnInit(): void {
    this.getKpis();
  }




  getKpis(): void {
    this.loading = true;
     const userID = this.auth.getCurrentSession()?.id ?? "";
    this.kpiService.getByUserId(userID).subscribe(
      (data) => {
        this.kpis = data.body;
        this.loading = false;
      },
      (error) => {
        this.message.error('Error fetching KPIs');
        this.loading = false;
      }
    );
  }

  // deleteKpi(id: string): void {
  //   this.kpiService.delete(id).subscribe(
  //     () => {
  //       this.message.success('KPI deleted successfully');
  //       this.getKpis();
  //     },
  //     (error) => {
  //       this.message.error('Error deleting KPI');
  //     }
  //   );
  // }
}
