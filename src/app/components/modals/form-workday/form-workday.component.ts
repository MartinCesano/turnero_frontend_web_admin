import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { WorkdayService } from '../../../core/services/workday.service';
import { ModalService } from '../modal.service';
import { AppointmentTimeService } from '../../../core/services/appointment-time.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { StateService } from '../../../core/services/state.service';
import { IAppointmentTime } from '../../../interfaces/appointment-time.interface';
import { IWorkday } from '../../../interfaces/workday.interface';
import { IAppointment, IAppointmentNew } from '../../../interfaces/appointment.interface'; // Asegúrate de definir esta interfaz si aún no existe
import { IState } from '../../../interfaces/state.interface'; // Asegúrate de definir esta interfaz si aún no existe

@Component({
  selector: 'app-form-workday',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-workday.component.html',
  styleUrls: ['./form-workday.component.css'],
})
export class FormWorkdayComponent implements OnInit {
  appointmentTimes: IAppointmentTime[] = [];
  selectedWorkday?: IWorkday;
  appointmentTimesSelected: IAppointmentTime[] = [];
  appointmentParaHabilitarLosChecks: IAppointmentTime[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string, // Esto es la fecha del día seleccionado
    private dialogRef: MatDialogRef<FormWorkdayComponent>,
    public dialog: MatDialog,
    private workdayService: WorkdayService,
    private modalService: ModalService,
    private appointmentTimeService: AppointmentTimeService,
    private appointmentService: AppointmentService,
    private stateService: StateService
  ) {}

  async ngOnInit(): Promise<void> {
    this.modalService.loading('Cargando horarios');
    try {
      await this.getAppointmentTimes();
      this.selectedWorkday = await this.workdayService.getWorkdayByDate(this.data); // Ajusta según el tipo de datos
      console.log("workdayyyyyyyyyyyyyyyyyyy", this.selectedWorkday)
      await this.initializeSelectedAppointments();
    } catch (error) {
      console.error('Error fetching workday:', error);
    }
    this.modalService.loadingClose();
  }

  selectClosed(event: Event) {
    const target = event.target as HTMLInputElement;
    if (this.selectedWorkday) {
      this.selectedWorkday.close = !target.checked;
    }
  }

  async saveWorkday() {
    try {
      if (this.selectedWorkday) {
        this.modalService.loading(null);
        await this.createAppointmentForWorkday();

        await this.workdayService.updateWorkday(this.selectedWorkday.id, {
          close: this.selectedWorkday.close,
        });
        this.modalService.loadingClose();
        this.modalService.openMenssageTypes({
          text: 'Día actualizado correctamente.',
          subtitle: null,
          backendUrl: null,
          type: 'success',
        });
        this.dialogRef.close();
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async createAppointmentForWorkday() {

    // Filtrar los appointmentTimes que coinciden // estos estan seleccionados y ya fueron creados
    const appointmentTimesCoinciden = this.appointmentTimesSelected.filter((apptSelected: any) => 
      this.selectedWorkday?.appointment.some((appt: any) => appt.appointmentTimes.id === apptSelected.id)
    );

    const appointmentsParaHabilitar = this.selectedWorkday?.appointment.filter((appt: any) =>  // estos estan seleccionados y ya fueron creados,(estan disabled) hay que habilitarlos
      this.appointmentTimesSelected.some((apptSelected: any) => appt.appointmentTimes.id === apptSelected.id && appt.state?.name === 'Disabled')
    );

    const appointmentParaCrear = this.appointmentTimesSelected.filter( //filtra los appointment que no coinciden seran creados
      (apptSelected) =>
        !this.selectedWorkday?.appointment?.some(
          (appt) => appt.appointmentTimes.id === apptSelected.id
        )
    );

    const appointmentsParaDeshabilitar = this.selectedWorkday?.appointment.filter( //filtra los appointment que no coinciden seran deshabilitados
      (appt) =>
        !this.appointmentTimesSelected.some(
          (apptSelected) => appt.appointmentTimes.id === apptSelected.id
        )
    );

    if (appointmentParaCrear && this.selectedWorkday) {
      const state = await this.stateService.getStateByName('Free');
      const newAppointmentParaCrear: IAppointmentNew[] = [];
      for await (const appointmentsTime of appointmentParaCrear) {
        newAppointmentParaCrear.push({
          workday: this.selectedWorkday,
          appointmentTimes: appointmentsTime,
          state: state
        });
      }
      await this.appointmentService.createAppointment(newAppointmentParaCrear);
    }


    if (appointmentsParaDeshabilitar) {
      const arrayAppointmentsParaDeshabilitar = appointmentsParaDeshabilitar.map(
        (appt) => appt.id
      );
      await this.appointmentService.disabledAppointment(arrayAppointmentsParaDeshabilitar);
    }

    if (appointmentsParaHabilitar){
      const state = await this.stateService.getStateByName('Free');
      await this.appointmentService.changeStatusMany(appointmentsParaHabilitar, state);
    }

  }

  cancelarWorkday() {
    this.dialogRef.close();
  }

  async initializeSelectedAppointments() {
    if (this.selectedWorkday && this.selectedWorkday.appointment) {
      this.appointmentTimesSelected = this.selectedWorkday.appointment
        .filter((appt) => appt.appointmentTimes && appt.state.name === 'Free')
        .map((appt) => appt.appointmentTimes);
        this.appointmentParaHabilitarLosChecks = this.selectedWorkday.appointment.map(
          (appt) => appt.appointmentTimes
        );
    }
  }

  isAppointmentTimeInSchedule(appointment: IAppointmentTime): boolean {
    if (!this.appointmentParaHabilitarLosChecks.length || !this.selectedWorkday?.appointment) return false;
    
    const appointmentTimeQueCoindice = this.appointmentParaHabilitarLosChecks.filter(
      (appt) => appt.id === appointment.id
    );

    const appointmentCoincide = this.selectedWorkday.appointment.filter(
      (appt) => appt.appointmentTimes.id === appointment.id
    );

    if (appointmentCoincide.length && (appointmentCoincide[0].state?.name === "Reserved" || appointmentCoincide[0].state?.name === "Free" || appointmentCoincide[0].state?.name === "finish" || appointmentCoincide[0].state?.name === "defeated") && (appointmentTimeQueCoindice.length > 0)) {
      return true;
    } else {
      return false;
    }
  }

  isAppointmentTimeInScheduleDisabled(appointment: IAppointmentTime): boolean {
    if (this.selectedWorkday && this.selectedWorkday.appointment) {
      const isAppointmentCreate = this.appointmentParaHabilitarLosChecks.some(
        (appt) => appt.id === appointment.id
      );

      const isAppointmentStateReserved = this.selectedWorkday.appointment.filter(
        (appt) =>
          appt.appointmentTimes.id === appointment.id &&
          appt.state?.name !== 'Free' && appt.state?.name !== 'Disabled'
      );

      console.log("isAppointmentStateReserved", isAppointmentStateReserved)
      if (isAppointmentStateReserved && isAppointmentStateReserved.length > 0 && isAppointmentStateReserved[0].state && (isAppointmentStateReserved[0].state.name === 'Reserved' || isAppointmentStateReserved[0].state.name === 'finish')) {
        console.log("entro a reserved")
        const fila = document.getElementById(appointment.id.toString());
        fila?.classList.add('table-success');
      } else if (isAppointmentStateReserved && isAppointmentStateReserved.length > 0 && isAppointmentStateReserved[0].state && isAppointmentStateReserved[0].state.name === 'defeated') {
        const fila = document.getElementById(appointment.id.toString());  
        fila?.classList.add('table-danger');
      }


      return isAppointmentCreate && isAppointmentStateReserved.length > 0;
    }
    return false;
  }

  selectAppointmentTime(event: Event, appointmentTime: IAppointmentTime) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.appointmentTimesSelected.push(appointmentTime);
    } else {
      this.appointmentTimesSelected = this.appointmentTimesSelected.filter(
        (appt) => appt.id !== appointmentTime.id
      );
    }
  }

  async getAppointmentTimes() {
    try {
      this.appointmentTimes =
        await this.appointmentTimeService.getAppointmentTimes();
    } catch (error) {
      console.error('Error fetching appointment times:', error);
    }
  }
}
