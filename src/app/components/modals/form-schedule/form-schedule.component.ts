import { Component, Inject, OnInit } from '@angular/core';
import { FormCustomerComponent } from '../form-customer/form-customer.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentTimeService } from '../../../core/services/appointment-time.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../core/services/schedule.service';

export interface AppointmentTime {
  id: number;
  startTime: string; // Ajusta el tipo según sea necesario, por ejemplo, Date
}

@Component({
  selector: 'app-form-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-schedule.component.html',
  styleUrl: './form-schedule.component.css'
})
export class FormScheduleComponent {
  appointmentTimes: any[] = [];
  appointmentTimesForUpdate: any[] = [];
  name = "";
  
  constructor(
     @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormCustomerComponent>,
    public dialog: MatDialog,
    private appointmentTimeService:AppointmentTimeService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    this.getAppointmentTimes();
  }


  async getAppointmentTimes() {
    try {
      const appointmentTimes = await this.appointmentTimeService.getAppointmentTimes();
      this.appointmentTimes = appointmentTimes.sort((a: AppointmentTime, b: AppointmentTime) => a.startTime.localeCompare(b.startTime));
      this.appointmentTimesForUpdate = this.data.appointmentTimes.slice().sort((a: AppointmentTime, b: AppointmentTime) => a.startTime.localeCompare(b.startTime)); // crea una copia del array ordenada
      this.name = this.data.name.slice();
    } catch (error) {
      console.error('Error fetching appointment times:', error);
    }
  }

  isAppointmentTimeInSchedule(appointmentTime: any): any {

    if(this.data){
      if (this.data.appointmentTimes.some((time: any) => time.id === appointmentTime.id)){
        return true;
      }else{
        return false;
      }
    }else{
      return
    }
  }

  selectAppointmentTime(event: any, appointmentTime: any) {
    if (event.target.checked) {
      this.appointmentTimesForUpdate.push(appointmentTime);
    } else {
      this.appointmentTimesForUpdate = this.appointmentTimesForUpdate.filter((at) => at.id !== appointmentTime.id);
    }
  }

  saveSchedule(){
    if(this.data){
      //es put
      this.scheduleService.updateSchedule(this.data.id, {name: this.name, appointmentTimes: this.appointmentTimesForUpdate});
    }else{
      //es post
      this.scheduleService.createSchedule({name: this.name, appointmentTimes: this.appointmentTimesForUpdate});
    }

    this.dialogRef.close({ name: this.name, appointmentTimes: this.appointmentTimesForUpdate });
    
  }

}
