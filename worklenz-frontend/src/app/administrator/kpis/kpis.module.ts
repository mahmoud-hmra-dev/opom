import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzProgressModule} from 'ng-zorro-antd/progress';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';

import {NzAffixModule} from 'ng-zorro-antd/affix';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {AdministratorModule} from '../administrator.module';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzSegmentedModule} from 'ng-zorro-antd/segmented';
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NzRateModule} from "ng-zorro-antd/rate";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {StatusFormComponent} from "../components/status-form/status-form.component";
import {AvatarsComponent} from "../components/avatars/avatars.component";
import {ProjectMembersFormComponent} from "../components/project-members-form/project-members-form.component";
import {ProjectFormModalComponent} from "../components/project-form-modal/project-form-modal.component";
import {ImportTasksTemplateComponent} from "../components/import-tasks-template/import-tasks-template.component";
import {NzStatisticModule} from "ng-zorro-antd/statistic";



import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {TaskViewModule} from "../components/task-view/task-view.module";
import {NzNoAnimationModule} from "ng-zorro-antd/core/no-animation";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {FirstCharUpperPipe} from "@pipes/first-char-upper.pipe";
import {WlSafeArrayPipe} from "@pipes/wl-safe-array.pipe";
import {SafeStringPipe} from "@pipes/safe-string.pipe";
import {DateFormatterPipe} from "../../pipes/date-formatter.pipe";

import {ProjectUpdatesDrawerComponent} from "@admin/components/project-updates-drawer/project-updates-drawer.component";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {ProjectUpdatesInputComponent} from "@admin/components/project-updates-input/project-updates-input.component";
import {ProjectUpdatesListComponent} from "@admin/components/project-updates-list/project-updates-list.component";
import {NgChartsModule} from "ng2-charts";
import {EllipsisPipe} from "@pipes/ellipsis.pipe";
import {
  ProjectTemplateCreateDrawerComponent
} from "@admin/components/project-template-create-drawer/project-template-create-drawer.component";
import {
  ProjectTemplateImportDrawerComponent
} from "@admin/components/project-template-import-drawer/project-template-import-drawer.component";

import {RxFor} from "@rx-angular/template/for";


import { KpisRoutingModule } from './kpis-routing.module';
import { ListKpisComponent } from './list-kpis/list-kpis.component';
import { CreateKpiComponent } from './create-kpi/create-kpi.component';
import { AppKpiAssignComponent } from './app-kpi-assign/app-kpi-assign.component';
import { DropdownListKpisComponent } from './dropdown-list-kpis/dropdown-list-kpis.component';
import { KpiReportsComponent } from './kpi-reports/kpi-reports.component';
import { RptHeaderComponent } from '../reporting/components/rpt-header/rpt-header.component';


@NgModule({
  declarations: [
        ListKpisComponent,
        CreateKpiComponent,
        AppKpiAssignComponent,
        DropdownListKpisComponent,
        KpiReportsComponent
  ],
  imports: [
    CommonModule,
    KpisRoutingModule,
    RptHeaderComponent,
    CommonModule,
    NzDividerModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzAutocompleteModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzTabsModule,
    NzIconModule,
    NzListModule,
    NzTypographyModule,
    NzSelectModule,
    NzTagModule,
    FormsModule,
    NzCheckboxModule,
    NzProgressModule,
    NzPopconfirmModule,
    NzAvatarModule,
    NzToolTipModule,
    NzSkeletonModule,
    NzRadioModule,
    NzDatePickerModule,
    NzEmptyModule,
    ScrollingModule,
    NzCardModule,
    NzSpaceModule,
    NzBreadCrumbModule,
    NzAffixModule,
    NzLayoutModule,
    NzSwitchModule,
    AdministratorModule,
    NzSpinModule,
    NzBadgeModule,
    NzPopoverModule,
    NzCollapseModule,
    NzSegmentedModule,
    NzDrawerModule,
    NzDropDownModule,
    DragDropModule,
    NzRateModule,
    NzAlertModule,
    StatusFormComponent,
    AvatarsComponent,
    ProjectMembersFormComponent,
    ProjectFormModalComponent,
    ImportTasksTemplateComponent,
    NzStatisticModule,
    NzDescriptionsModule,
    TaskViewModule,
    NzNoAnimationModule,
    NzPipesModule,
    FirstCharUpperPipe,
    WlSafeArrayPipe,
    SafeStringPipe,
    DateFormatterPipe,
    ProjectUpdatesDrawerComponent,
    NzCommentModule,
    ProjectUpdatesInputComponent,
    ProjectUpdatesListComponent,
    NgChartsModule,
    EllipsisPipe,
    ProjectTemplateCreateDrawerComponent,
    ProjectTemplateImportDrawerComponent,
    RxFor,
  ],
  exports:[

    ListKpisComponent,
    CreateKpiComponent,
    AppKpiAssignComponent,
    DropdownListKpisComponent
  ]
})
export class KpisModule { }
