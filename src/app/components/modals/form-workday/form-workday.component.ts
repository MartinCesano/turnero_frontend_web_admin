import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { WorkdayService } from '../../../core/services/workday.service';
import { ModalService } from '../modal.service';
import { AppointmentTimeService } from '../../../core/services/appointment-time.service';

@Component({
  selector: 'app-form-workday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-workday.component.html',
  styleUrl: './form-workday.component.css'
})
export class FormWorkdayComponent {

  appointmentTimes: any[] = [];

  workday: any = {}


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormWorkdayComponent>,
    public dialog: MatDialog,
    private workdayService: WorkdayService,
    private modalService: ModalService,
    private appointmentTimeService:AppointmentTimeService
  ) { }


  async ngOnInit(): Promise<void> {
    this.getAppointmentTimes();
    console.log('data', this.data);
    const response = await this.workdayService.getWorkdayByDate(this.data)
    this.workday = response.data;
    console.log('workday', this.workday);
  }




  selectClosed(event: any){
    console.log('event', event);
    this.workday[0].close = event.target.checked === 'true';
    }

  saveWorkday(){
    try{
      this.modalService.loading(null)
      this.workdayService.updateWorkday(this.workday[0].id, this.workday[0])
      this.modalService.loadingClose()
      this.modalService.openMenssageTypes({ text: "Dia actualizado correctamente.", subtitle: null, backendUrl: null, type: "success" });
      //this.modalService.loadingClose()
      this.dialogRef.close();
    } catch (error) {
      console.log('error', error);
    }

  }

  cancelarWorkday(){
    this.dialogRef.close();
  }



  //#region funciones table

  isAppointmentTimeInSchedule(appointment: any) {
    console.log('appointment', appointment);
    console.log('workday', this.workday[0]);
    
    const isInSchedule = this.workday[0].appointment.some((appt: any) => 
      appt.appointmentTimes.id === appointment.id
    );
    
    console.log(isInSchedule);
    return isInSchedule;
  }




  selectAppointmentTime(event: any, appointmentTime: any) {
  
  }


  async getAppointmentTimes() {
    try {
      this.appointmentTimes = await this.appointmentTimeService.getAppointmentTimes();
      console.log(this.appointmentTimes)
    } catch (error) {
      console.error('Error fetching appointment times:', error);
    }
  }


  //endregion


}


