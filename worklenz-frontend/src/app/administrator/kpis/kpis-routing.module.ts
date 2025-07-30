import { CreateKpiComponent } from './create-kpi/create-kpi.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListKpisComponent } from './list-kpis/list-kpis.component';
import { KpiReportsComponent } from './kpi-reports/kpi-reports.component';

const routes: Routes = [
  {
    path:'',
    component: ListKpisComponent
  },
  {
    path:'create',
    component: CreateKpiComponent
  },
  {
    path:'KpiReports',
    component:KpiReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpisRoutingModule { }
