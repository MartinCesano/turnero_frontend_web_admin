import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WorkdayService } from '../../../core/services/workday.service';
import { ModalService } from '../modal.service';
import { ISchedule } from '../../../interfaces/schedule.interface';
import { IApplySchedule } from '../../../interfaces/workday.interface';


@Component({
  selector: 'app-apply-schedule',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './apply-schedule.component.html',
  styleUrls: ['./apply-schedule.component.css'],
})
export class ApplyScheduleComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: { [key: string]: boolean } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ISchedule,
    private dialogRef: MatDialogRef<ApplyScheduleComponent>,
    public dialog: MatDialog,
    private workdayService:WorkdayService,
    private modalService:ModalService
  ) { }

  ngOnInit(): void {
    // Initialize selectedDays to ensure all checkboxes are false initially
    this.daysOfWeek.forEach(day => this.selectedDays[day] = false);
  }

  async applySchedule(): Promise<void> {
    this.modalService.loading("aplicando los horarios");

    // Create the JSON object
    const applySchedule : IApplySchedule = {
      startDate: this.startDate,
      endDate: this.endDate,
      applyDays: this.daysOfWeek.filter(day => this.selectedDays[day]),
      appointmentTimes: this.data.appointmentTimes
    };

    console.log('Generated JSON:', JSON.stringify(applySchedule, null, 2));
    // Implement your form submission logic here, e.g., send the JSON to a server

    const workday = await this.workdayService.applySchedule(applySchedule);

    console.log('workday:', workday);
    this.modalService.loadingClose();
    // Close the modal
    this.dialogRef.close();
    this.modalService.openMenssageTypes({ text: "Horarios aplicados correctamente", subtitle: "Los horarios se han aplicado correctamente", type: "success" });
  }

  getDayLabel(day: string): string {
    const labels: { [key: string]: string } = {
      'Monday': 'Lunes',
      'Tuesday': 'Martes',
      'Wednesday': 'Miércoles',
      'Thursday': 'Jueves',
      'Friday': 'Viernes',
      'Saturday': 'Sábado',
      'Sunday': 'Domingo'
    };
    return labels[day] || day;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
