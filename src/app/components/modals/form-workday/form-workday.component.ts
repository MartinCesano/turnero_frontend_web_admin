import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { WorkdayService } from '../../../core/services/workday.service';
import { ModalService } from '../modal.service';
import { AppointmentTimeService } from '../../../core/services/appointment-time.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'app-form-workday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-workday.component.html',
  styleUrls: ['./form-workday.component.css']
})
export class FormWorkdayComponent implements OnInit {

  appointmentTimes: any[] = [];
  workday: any = {};
  appointmentTimesSelected: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormWorkdayComponent>,
    public dialog: MatDialog,
    private workdayService: WorkdayService,
    private modalService: ModalService,
    private appointmentTimeService: AppointmentTimeService,
    private appointmentService: AppointmentService,
    private stateService: StateService
  ) { }

  async ngOnInit(): Promise<void> {
    this.modalService.loading("Cargando horarios");
    try{
      await this.getAppointmentTimes();
      const response = await this.workdayService.getWorkdayByDate(this.data);
      this.workday = response;
      this.initializeSelectedAppointments();
    } catch (error) {
      console.error('Error fetching workday:', error);
    }
    this.modalService.loadingClose();
  }

  

  selectClosed(event: any) {
    this.workday.close = !event.target.checked;
  }

  async saveWorkday() {
    try {
      this.modalService.loading(null);
      await this.createAppointmentForWorkday()
      this.workdayService.updateWorkday(this.workday.id, {close:this.workday.close});
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({ text: "Día actualizado correctamente.", subtitle: null, backendUrl: null, type: "success" });
      this.dialogRef.close();
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async createAppointmentForWorkday() {
    // Filtrar los appointmentTimes que coinciden // estos estan seleccionados y ya fueron creados
    const appointmentTimesCoinciden = this.appointmentTimesSelected.filter((apptSelected: any) => 
      this.workday.appointment.some((appt: any) => appt.appointmentTimes.id === apptSelected.id)
    );
  
    // Filtrar los appointmentTimes que no coinciden //estos son los que el admin decidio seleccionar pero no estan creados
    const appointmentTimesNoCoinciden = this.appointmentTimesSelected.filter((apptSelected: any) => 
      !this.workday.appointment.some((appt: any) => appt.appointmentTimes.id === apptSelected.id)
    );
  
    // Filtrar los appointments que coinciden  //estos son los que el admin decidio seleccionar pero ya estan creados
    const appointmentsCoinciden = this.workday.appointment.filter((appt: any) => 
      this.appointmentTimesSelected.some((apptSelected: any) => appt.appointmentTimes.id === apptSelected.id)
    );
  
    // Filtrar los appointments que no coinciden //estos son los que el admin decidio no seleccionar y estan creados, hay que borrarlo o desactivarlo.
    const appointmentsNoCoinciden = this.workday.appointment.filter((appt: any) => 
      !this.appointmentTimesSelected.some((apptSelected: any) => appt.appointmentTimes.id === apptSelected.id)
    );
  
    if(appointmentTimesNoCoinciden){
      const state = await this.stateService.getStateByName("Free");
      let newAppointmentParaCrear:any = [];
      for await (let appointmentsTime of appointmentTimesNoCoinciden) {
        newAppointmentParaCrear.push({
          workday: this.workday.id,
          appointmentTimes: appointmentsTime.id,
          state:parseInt(state.id)       
        });
      }
      await this.appointmentService.createAppointment(newAppointmentParaCrear);
    }
    if(appointmentsNoCoinciden){
      const arrayAppointmentsNoCoinciden = await appointmentsNoCoinciden.map((appt: any) => appt.id);
      await this.appointmentService.deleteAppointment(arrayAppointmentsNoCoinciden);
    }
  }
  


  cancelarWorkday() {
    this.dialogRef.close();
  }

  initializeSelectedAppointments() {
    if (this.workday && this.workday.appointment) {
      this.appointmentTimesSelected = this.workday.appointment.map((appt: any) => appt.appointmentTimes);
    }
  }

  isAppointmentTimeInSchedule(appointment: any): boolean {
    return this.appointmentTimesSelected.some((appt: any) => appt.id === appointment.id);
  }

  isAppointmentTimeInScheduleDisabled(appointment: any): boolean {
    const isAppointmentCreate =this.appointmentTimesSelected.some((appt: any) => appt.id === appointment.id);
    const isAppointmentStateResered = this.workday.appointment.some((appt: any) => appt.appointmentTimes.id === appointment.id && appt.state.name == "Reserved");
    if(isAppointmentCreate && isAppointmentStateResered){
    return true;
    }
    return false
  }


  selectAppointmentTime(event: any, appointmentTime: any) {
    if (event.target.checked) {
      this.appointmentTimesSelected.push(appointmentTime);
    } else {
      this.appointmentTimesSelected = this.appointmentTimesSelected.filter((appt: any) => appt.id !== appointmentTime.id);
    }
  }

  async getAppointmentTimes() {
    try {
      this.appointmentTimes = await this.appointmentTimeService.getAppointmentTimes();
    } catch (error) {
      console.error('Error fetching appointment times:', error);
    }
  }

}
