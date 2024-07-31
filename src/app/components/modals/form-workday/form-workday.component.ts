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
import { IAppointment } from '../../../interfaces/appointment.interface'; // Asegúrate de definir esta interfaz si aún no existe
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
    const appointmentTimesNoCoinciden = this.appointmentTimesSelected.filter(
      (apptSelected) =>
        !this.selectedWorkday?.appointment?.some(
          (appt) => appt.appointmentTimes.id === apptSelected.id
        )
    );

    const appointmentsNoCoinciden = this.selectedWorkday?.appointment.filter(
      (appt) =>
        !this.appointmentTimesSelected.some(
          (apptSelected) => appt.appointmentTimes.id === apptSelected.id
        )
    );

    if (appointmentTimesNoCoinciden && this.selectedWorkday) {
      const state = await this.stateService.getStateByName('Free');
      let newAppointmentParaCrear: { workdayId: number; appointmentTimeId: number; stateId: number }[] = [];
      for await (let appointmentsTime of appointmentTimesNoCoinciden) {
        newAppointmentParaCrear.push({
          workdayId: this.selectedWorkday.id,
          appointmentTimeId: appointmentsTime.id,
          stateId: parseInt(state.id),
        });
      }
      await this.appointmentService.createAppointment(newAppointmentParaCrear);
    }

    if (appointmentsNoCoinciden) {
      const arrayAppointmentsNoCoinciden = appointmentsNoCoinciden.map(
        (appt) => appt.id
      );
      await this.appointmentService.deleteAppointment(arrayAppointmentsNoCoinciden);
    }
  }

  cancelarWorkday() {
    this.dialogRef.close();
  }

  async initializeSelectedAppointments() {
    if (this.selectedWorkday && this.selectedWorkday.appointment) {
      this.appointmentTimesSelected = this.selectedWorkday.appointment.map(
        (appt) => appt.appointmentTimes
      );
    }
    console.log("appointmentTimesSelecteddddddddddddddddddddddddd", this.appointmentTimesSelected)
  }

  isAppointmentTimeInSchedule(appointment: IAppointmentTime): boolean {
    console.log("----------------------------------------------------")
    console.log("appointmentTimesSelected", this.appointmentTimesSelected)
    console.log("appointment", appointment)
    if (!this.appointmentTimesSelected.length || !this.selectedWorkday?.appointment) return false;
    
    const appointmentTimeQueCoindice = this.appointmentTimesSelected.filter(
      (appt) => appt.id === appointment.id
    );

    console.log("appointmentTimeQueCoindice", appointmentTimeQueCoindice)
    const appointmentCoincide = this.selectedWorkday.appointment.filter(
      (appt) => appt.appointmentTimes.id === appointment.id
    );

    console.log("appointmentCoincide", appointmentCoincide)
    if (appointmentCoincide.length && (appointmentCoincide[0].state?.name === "Reserved" || appointmentCoincide[0].state?.name === "Free" || appointmentCoincide[0].state?.name === "finish") && (appointmentTimeQueCoindice.length > 0)) {
      console.log("retorno truee")
      return true;
    } else {
      console.log("retorno false")
      return false;
    }
  }

  isAppointmentTimeInScheduleDisabled(appointment: IAppointmentTime): boolean {
    if (this.selectedWorkday && this.selectedWorkday.appointment) {
      const isAppointmentCreate = this.appointmentTimesSelected.some(
        (appt) => appt.id === appointment.id
      );

      const isAppointmentStateReserved = this.selectedWorkday.appointment.some(
        (appt) =>
          appt.appointmentTimes.id === appointment.id &&
          appt.state?.name === 'Reserved'
      );

      return isAppointmentCreate && isAppointmentStateReserved;
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
