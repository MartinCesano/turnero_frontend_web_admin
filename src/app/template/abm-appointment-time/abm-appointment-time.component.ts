import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentTimeService } from '../../core/services/appointment-time.service';
import DataTable from 'datatables.net-dt';
import { ModalService } from '../../components/modals/modal.service';
import { IAppointmentTime } from '../../interfaces/appointment-time.interface';
import { IAppointmentTimeNew } from '../../interfaces/appointment-time.interface';
import { get } from 'jquery';

@Component({
  selector: 'abm-appointment-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-appointment-time.component.html',
  styleUrls: ['./abm-appointment-time.component.css']
})
export class AbmAppointmentTimeComponent {
  appointmentTimes: IAppointmentTime[] = [];
  selectedAppointment?: IAppointmentTime; // Puede ser undefined
  table: any;

  constructor(private appointmentTimeService: AppointmentTimeService, private modalService: ModalService) { }

  async ngOnInit(): Promise<void> {
    await this.getAppointmentTimes();
    this.initializeDataTable();
  }

  async getAppointmentTimes() {
    this.modalService.loading("Cargando horas")
    try {
      this.appointmentTimes = await this.appointmentTimeService.getAppointmentTimes();
    } catch (error) {
      console.error('Error fetching appointment times:', error);
    }
    this.modalService.loadingClose();
  }

  // Región tabla de turnos
  initializeDataTable(): void {
    this.getAppointmentTimes();
    const tableElement = document.getElementById('appointmentTable') as HTMLTableElement;
    if (tableElement) {
      if (this.table) {
        this.table.destroy();
      }
      this.table = new DataTable(tableElement, {
        searching: false,
        ordering: true,
        paging: false,
        info: false,
        data: this.appointmentTimes.map((appointmentTime: IAppointmentTime) => [
          appointmentTime.startTime,
          appointmentTime.endTime,
          `
          <button class="btn btn-outline-success btn-sm rounded me-2 edit-appointmentTime" aria-label="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm rounded delete-appointmentTime" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" aria-label="Delete" data-customer='${JSON.stringify(appointmentTime)}'>
            <i class="bi bi-trash"></i>
          </button>
          `
        ]),
        columns: [
          { title: "Hora Inicio" },
          { title: "Hora Fin" },
          { title: "Acciones" }
        ],
      });

      // Agregar eventos de click para los botones de editar y eliminar
      $(document).on('click', '.edit-appointmentTime', (event) => {
        this.selectedAppointment = JSON.parse((event.currentTarget as HTMLElement).getAttribute('data-customer')!);
        // Llama a la función solo si selectedAppointment no es undefined
        if (this.selectedAppointment) {
          this.editAppointmentTime(this.selectedAppointment);
        }
      });

      $(document).on('click', '.delete-appointmentTime', (event) => {
        this.selectedAppointment = JSON.parse((event.currentTarget as HTMLElement).getAttribute('data-customer')!);
      });
    }
  }
  // Fin región tabla de turnos

  async createAppointmentTime() {
    try {
      const startTimeInput = document.getElementById('startTime') as HTMLInputElement;
      const endTimeInput = document.getElementById('endTime') as HTMLInputElement;

      const newAppointmentTime = {
        startTime: startTimeInput.value.toString(),
        endTime: endTimeInput.value.toString()
      };

      const response = await this.appointmentTimeService.createAppointmentTime(newAppointmentTime);

      // Añadir la nueva fila a la tabla
      this.table.row.add([
        response.startTime,
        response.endTime,
        `
        <button class="btn btn-outline-success btn-sm rounded me-2 edit-appointmentTime" aria-label="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm rounded delete-appointmentTime" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" aria-label="Delete" data-customer='${JSON.stringify(response)}'>
          <i class="bi bi-trash"></i>
        </button>
        `
      ]).draw(false);

      this.appointmentTimes.push(response);
      this.initializeDataTable();

    } catch (error) {
      console.error('Error creating appointment time:', error);
    }
  }

  async deleteAppointmentTime() {
    try {
      // Verificar si selectedAppointment está definido antes de usarlo
      if (this.selectedAppointment) {
        await this.appointmentTimeService.deleteAppointmentTime(this.selectedAppointment.id);
        this.initializeDataTable();
        this.selectedAppointment = undefined;
      }
    } catch (error) {
      console.error('Error deleting appointment time:', error);
    }
  }

  // async updateAppointmentTime() {
  //   try {
  //     // Verificar si selectedAppointment está definido antes de usarlo
  //     if (this.selectedAppointment) {
  //       await this.appointmentTimeService.updateAppointmentTime(this.selectedAppointment);
  //       this.appointmentTimes = this.appointmentTimes.map(app =>
  //         app.id === this.selectedAppointment.id ? this.selectedAppointment : app
  //       );
  //       this.selectedAppointment = undefined;
  //       this.initializeDataTable();
  //     }
  //   } catch (error) {
  //     console.error('Error updating appointment time:', error);
  //   }
  // }

  // Método para editar un appointment time
  editAppointmentTime(appointmentTime: IAppointmentTime) {
    // Implementa la lógica de edición aquí
    console.log('Editing appointment time:', appointmentTime);
  }
}
