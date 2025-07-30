import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { KpiService } from '@services/kpi.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'worklenz-create-kpi',
  templateUrl: './create-kpi.component.html',
  styleUrls: ['./create-kpi.component.scss']
})
export class CreateKpiComponent implements OnInit {
  kpiForm!: FormGroup;
  loading = false;
  user!: any;

  // Frequency options
  frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Per Project', value: 'per_project' }
  ];

  // Unit/Target Value Type options
  unitOptions = [
    { label: 'Percentage %', value: 'percentage' },
    { label: 'Dollar $', value: 'dollar' },
    { label: 'Calls', value: 'calls' },
    { label: 'Meetings', value: 'meetings' },
    { label: 'MSA', value: 'msa' },
    { label: 'NDA', value: 'nda' },
    { label: 'MOU', value: 'mou' }
  ];

  constructor(
    private fb: FormBuilder,
    private kpiService: KpiService,
    private message: NzMessageService,
    private auth: AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentSession();
    this.kpiForm = this.fb.group({
      kpis: this.fb.array([]) // Initialize empty FormArray
    });

    this.addKpi(); // Add at least one KPI by default
  }

  get kpiControls() {
    return (this.kpiForm.get('kpis') as FormArray).controls as FormGroup[];
  }

  addKpi(): void {
    const kpiGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      calculation_method: ['', Validators.required],
      frequency: ['', Validators.required],
      target_value: [null, Validators.required],
      current_value: [null],
      unit: ['', Validators.required],
      responsible_id: ['', Validators.required],
      accountable_id: ['', Validators.required],
      user_id: [this.user.id, Validators.required],
      created_by: [this.user.id, Validators.required]
    });
    (this.kpiForm.get('kpis') as FormArray).push(kpiGroup);
  }

  removeKpi(index: number): void {
    (this.kpiForm.get('kpis') as FormArray).removeAt(index);
  }

  onAssignChanged(index: number, assignment: { responsible: string, accountable: string }) {
    const kpi = this.kpiControls[index];
    kpi.controls['responsible_id'].setValue(assignment.responsible);
    kpi.controls['accountable_id'].setValue(assignment.accountable);
  }

  submitForm(): void {
    if (this.kpiForm.invalid) {
      this.message.warning('Please fill in the required fields');
      return;
    }

    this.loading = true;
    this.kpiService.create(this.kpiForm.value.kpis).subscribe(
      (res: any) => {
        this.message.success('KPIs created successfully');
        this.kpiForm.reset();
        this.loading = false;
        this.router.navigate(['/opom/kpis']);
      },
      (error: any) => {
        this.message.error('Error creating KPIs');
        this.loading = false;
      }
    );
  }
}
