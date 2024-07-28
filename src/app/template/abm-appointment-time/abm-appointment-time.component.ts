import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentTimeService } from '../../core/services/appointment-time.service';
import DataTable from 'datatables.net-dt';

// Importaciones del modal
import { ModalService } from '../../components/modals/modal.service';

@Component({
  selector: 'abm-appointment-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-appointment-time.component.html',
  styleUrl: './abm-appointment-time.component.css'
})
export class AbmAppointmentTimeComponent {
  appointmentTimes: any[] = [];
  selectedAppointment: any;
  table: any;

  constructor(private appointmentTimeService: AppointmentTimeService, private modalService: ModalService) {}

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
        data: this.appointmentTimes.map((appointmentTime: any) => [
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
          { title: "Hora Fin"},
          { title: "Acciones"}
        ],
      });

      // Agregar eventos de click para los botones de editar y eliminar
      $(document).on('click', '.edit-appointmentTime', (event) => {
        this.selectedAppointment = JSON.parse((event.currentTarget as HTMLElement).getAttribute('data-customer')!);
        //this.editAppointmentTime(this.selectedAppointment);
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

  editAppointmentTime(customer: any) {
    this.selectedAppointment = { ...customer };
  }

  async deleteAppointmentTime() {
    try {
      if (this.selectedAppointment) {
        await this.appointmentTimeService.deleteAppointmentTime(this.selectedAppointment.id);
        this.appointmentTimes = this.appointmentTimes.filter(app => app.id !== this.selectedAppointment.id);
        // Eliminar la fila de la tabla
        const element = document.querySelector(`[data-customer='${JSON.stringify(this.selectedAppointment)}']`);
        if (element) {
          const closestRow = element.closest('tr');
          if (closestRow) {
            this.table.row($(closestRow)).remove().draw();
          }
        }
        this.selectedAppointment = null;
      }
    } catch (error) {
      console.error('Error deleting appointment time:', error);
    }
  }

  async updateAppointmentTime() {
    try {
      if (this.selectedAppointment) {
        await this.appointmentTimeService.updateAppointmentTime(this.selectedAppointment);
        this.appointmentTimes = this.appointmentTimes.map(app => 
          app.id === this.selectedAppointment.id ? this.selectedAppointment : app
        );
        this.selectedAppointment = null;
        this.initializeDataTable();
      }
    } catch (error) {
      console.error('Error updating appointment time:', error);
    }
  }
}
