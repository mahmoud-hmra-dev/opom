import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KpiService } from '@services/kpi.service';

@Component({
  selector: 'worklenz-dropdown-list-kpis',
  templateUrl: './dropdown-list-kpis.component.html',
  styleUrls: ['./dropdown-list-kpis.component.scss']
})
export class DropdownListKpisComponent {
  @Output() kpiChanged = new EventEmitter<{ selectedKpi: string }>();
  @Input() kpis: any[] = [];
  @Input('selectedKpi') selectedKpi: string | null = null;
  @Input('disabled') disabled: boolean = false;

  constructor(
    private kpiService: KpiService
  ) { }

 ngOnInit() {
    try {
       this.kpiService.getAll().subscribe((res:any)=>{
        this.kpis = res
       })
      console.log(this.kpis);
    } catch (error) {
      console.error('Error fetching KPIs', error);
    }
  }

  onKpiChange(value: any) {
    console.log(value);
    this.selectedKpi = value;
    this.emitSelection();
  }

  private emitSelection() {
    if (this.selectedKpi) {
      this.kpiChanged.emit({ selectedKpi: this.selectedKpi });
    }
  }

}
