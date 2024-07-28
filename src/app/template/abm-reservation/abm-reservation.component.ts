import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../core/services/reservation.service';
import { ModalService } from '../../components/modals/modal.service';
import DataTable from 'datatables.net-dt';


@Component({
  selector: 'app-abm-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-reservation.component.html',
  styleUrl: './abm-reservation.component.css',
})
export class AbmReservationComponent implements OnInit {


  reservations: any[] = [];
  selectedReservation: any;
  table: any;

  constructor(private reservationService: ReservationService, private modalService: ModalService) { }

  async ngOnInit(): Promise<void> {
    this.modalService.loading("cargando clientes");
    try {
      this.reservations = await this.reservationService.getReservation();
      this.initializeDataTable();
    } catch (error) {
      console.error(error);
    }
    this.modalService.loadingClose();
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById('customersTable') as HTMLTableElement;
    if (tableElement) {
      if (this.table) {
        this.table.destroy();
      }

      this.table = new DataTable(tableElement, {
        searching: true,
        ordering: true,
        paging: true,
        data: this.reservations.map((reservation) => [
          reservation.id,
          reservation.workday.date.split("T")[0]+ "  "+ reservation.appointment.appointmentTimes.startTime,
          reservation.customer.document,
          reservation.customer.name + ' ' + reservation.customer.lastname,
          reservation.state.name,
          `
          <button class="btn btn-outline-success btn-sm rounded me-2 edit-customer" data-customer='${JSON.stringify(reservation.customer)}' aria-label="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm rounded delete-customer" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-customer='${JSON.stringify(reservation.customer)}' aria-label="Delete">
            <i class="bi bi-trash"></i>
          </button>
          `
        ]),
        columns: [
          { title: "#" },
          { title: "Fecha" },
          { title: "Documento" },
          { title: "Nombre" },
          { title: "Estado" },
          { title: "Accion" }
        ],
      });

      // Agregar eventos de click para los botones de editar y eliminar
      $(document).on('click', '.edit-customer', (event) => {
        const reservation = JSON.parse((event.currentTarget as HTMLElement).getAttribute('data-customer')!);
        this.editReservation(reservation);
      });

      $(document).on('click', '.delete-customer', (event) => {
        const reservation = JSON.parse((event.currentTarget as HTMLElement).getAttribute('data-customer')!);
        this.selectedReservation = reservation;
      });
    }
  }

  editReservation(customer: any) {
    // Implementa la lógica para editar un cliente
    //this.selectedCustomer = customer;
    //this.modalService.formCustomer(customer); // Asumiendo que tienes un modal para editar
  }

  createReservation() {
    // Implementa la lógica para crear una reserva

  }

  async deleteCustomer() {
    // Implementa la lógica para eliminar una reserva

  }

}
