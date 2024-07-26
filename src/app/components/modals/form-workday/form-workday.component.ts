import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { WorkdayService } from '../../../core/services/workday.service';
import { ModalService } from '../modal.service';
import { AppointmentTimeService } from '../../../core/services/appointment-time.service';
import { AppointmentService } from '../../../core/services/appointment.service';

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
    private appointmentService: AppointmentService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getAppointmentTimes();
    const response = await this.workdayService.getWorkdayByDate(this.data);
    this.workday = response.data;
    this.initializeSelectedAppointments();
  }

  selectClosed(event: any) {
    this.workday[0].close = event.target.checked;
  }

  async saveWorkday() {
    try {
      this.modalService.loading(null);
      //await this.createAppointmentForWorkday()
      this.workdayService.updateWorkday(this.workday[0].id, this.workday[0]);
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({ text: "Día actualizado correctamente.", subtitle: null, backendUrl: null, type: "success" });
      this.dialogRef.close();
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async createAppointmentForWorkday() {
    // Filtrar los appointmentTimes que coinciden
    const appointmentTimesCoinciden = this.appointmentTimesSelected.filter((apptSelected: any) => 
      this.workday[0].appointment.some((appt: any) => appt.appointmentTimes.id === apptSelected.id)
    );
  
    // Filtrar los appointmentTimes que no coinciden
    const appointmentTimesNoCoinciden = this.appointmentTimesSelected.filter((apptSelected: any) => 
      !this.workday[0].appointment.some((appt: any) => appt.appointmentTimes.id === apptSelected.id)
    );
  
    // Filtrar los appointments que coinciden
    const appointmentsCoinciden = this.workday[0].appointment.filter((appt: any) => 
      this.appointmentTimesSelected.some((apptSelected: any) => appt.appointmentTimes.id === apptSelected.id)
    );
  
    // Filtrar los appointments que no coinciden
    const appointmentsNoCoinciden = this.workday[0].appointment.filter((appt: any) => 
      !this.appointmentTimesSelected.some((apptSelected: any) => appt.appointmentTimes.id === apptSelected.id)
    );
  
    //console.log('appointmentTimesCoinciden', appointmentTimesCoinciden);// estos estan seleccionados y ya fueron creados

    //console.log('appointmentTimesNoCoinciden', appointmentTimesNoCoinciden);//estos son los que el admin decidio seleccionar pero no estan creados

    //console.log('appointmentsCoinciden', appointmentsCoinciden); //estos son los que el admin decidio seleccionar pero ya estan creados

    //console.log('appointmentsNoCoinciden', appointmentsNoCoinciden);//estos son los que el admin decidio no seleccionar

    //if(appointmentTimesNoCoinciden){
    //  const newAppointmentParaCrear:any = [];
    //  for await (let appointmentsTime of appointmentTimesNoCoinciden) {
    //    newAppointmentParaCrear.push({
    //      workday: this.workday[0].id,
    //      appointmentTimes: appointmentsTime.id,
    //      state:2                //esto esta malllllllllllllll, tiene que buscar el estado libre en la base de datos, acomodar luego importanteeeeeeeeeeeeeeeeeeeeeeeee   muy importanteeeeeeeeeeeeeeeee
    //    });
    //    
    //  }
    //  console.log(newAppointmentParaCrear)
    //  const newAppointmentsCreados = await this.appointmentService.createAppointment(newAppointmentParaCrear);
    //  this.workday[0].appointment = await this.workday[0].appointment.concat(newAppointmentsCreados);
    // console.log('newAppointmentsCreados', this.workday[0]);
    //}

  }
  


  cancelarWorkday() {
    this.dialogRef.close();
  }

  initializeSelectedAppointments() {
    if (this.workday[0] && this.workday[0].appointment) {
      this.appointmentTimesSelected = this.workday[0].appointment.map((appt: any) => appt.appointmentTimes);
    }
  }

  isAppointmentTimeInSchedule(appointment: any): boolean {
    return this.appointmentTimesSelected.some((appt: any) => appt.id === appointment.id);
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
