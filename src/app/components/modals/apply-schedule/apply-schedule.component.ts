import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface ApplyScheduleForm {
  startDate: Date;
  endDate: Date;
  applyDays: {
    [key: string]: boolean; // Usar índice de tipo string para los días
  };
}

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApplyScheduleComponent>,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // Initialize selectedDays to ensure all checkboxes are false initially
    this.daysOfWeek.forEach(day => this.selectedDays[day] = false);
  }

  applySchedule(): void {
    // Create the JSON object
    const schedule = {
      startDate: this.startDate,
      endDate: this.endDate,
      applyDays: this.daysOfWeek.filter(day => this.selectedDays[day]),
      appointmentTimes: this.data.appointmentTimes
    };

    console.log('Generated JSON:', JSON.stringify(schedule, null, 2));
    // Implement your form submission logic here, e.g., send the JSON to a server

    // Close the modal
    this.dialogRef.close();
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
}
