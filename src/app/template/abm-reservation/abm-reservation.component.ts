import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../core/services/reservation.service';
import { ModalService } from '../../components/modals/modal.service';
import DataTable from 'datatables.net-dt';
import { GestorCancelarTurnoService } from '../../core/services/gestor-cancelar-turno.service';



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

  constructor(private reservationService: ReservationService,
     private modalService: ModalService,
     private gestorCancelarTurnoService: GestorCancelarTurnoService
    ) { }

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
          <button class="btn btn-outline-success btn-sm rounded me-2 edit-customer" data-customer='${JSON.stringify(reservation)}' aria-label="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm rounded delete-customer" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-customer='${JSON.stringify(reservation)}' aria-label="Delete">
            <i class="bi bi-x-circle"></i>
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
    this.modalService.formReservation(null); // Asumiendo que tienes un modal para crear
    

  }

  async cancelReservation() {
    try {
      if (this.selectedReservation.state.name === "earring") {
      // Cancela la reserva a través del servicio
      const newCancelReservation = await this.gestorCancelarTurnoService.cancelReservation(this.selectedReservation.id, this.selectedReservation.customer);
  
      // Actualiza el estado de la reserva seleccionada en el componente
      this.selectedReservation.state.name = newCancelReservation.state.name; // Suponiendo que el estado se actualiza a "Cancelado"
  
      // Abre el mensaje de éxito
      this.modalService.openMenssageTypes({
        text: "Reserva cancelada",
        subtitle: "La reserva fue cancelada con éxito",
        url: null,
        type: "success"
      });

      // Encuentra la fila correspondiente en la tabla y actualiza sus datos
      this.table.row((idx: number, data: any[]) => {
        return data[0] === this.selectedReservation.id;
      }).data([
        this.selectedReservation.id,
        this.selectedReservation.workday.date.split("T")[0] + "  " + this.selectedReservation.appointment.appointmentTimes.startTime,
        this.selectedReservation.customer.document,
        this.selectedReservation.customer.name + ' ' + this.selectedReservation.customer.lastname,
        this.selectedReservation.state.name,
        `
        <button class="btn btn-outline-success btn-sm rounded me-2 edit-customer" data-customer='${JSON.stringify(this.selectedReservation)}' aria-label="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm rounded delete-customer" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-customer='${JSON.stringify(this.selectedReservation)}' aria-label="Delete">
          <i class="bi bi-x-circle"></i>
        </button>
        `
      ]).draw(false);
  
    }else{
      this.modalService.openMenssageTypes({
        text: "Error al cancelar la reserva",
        subtitle: "La reserva no se puede cancelar porque no esta en un estado activa",
        url: null,
        type: "error"
      });
    }
    } catch (error) {
      console.error(error);
    }
  }
  
  
  

}
