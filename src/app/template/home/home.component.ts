import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../components/modals/modal.service';
import { WorkdayService } from '../../core/services/workday.service';
import DataTable from 'datatables.net-dt';
import { IWorkday } from '../../interfaces/workday.interface';
import { ReservationService } from '../../core/services/reservation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  // Corrige styleUrl a styleUrls
})
export class HomeComponent implements OnInit {

  workday?: IWorkday;
  table: any;
  date: Date = new Date();

  constructor(
    private modalService: ModalService,
    private workdayService: WorkdayService,
    private reservationService: ReservationService
  ) { }

  async ngOnInit(): Promise<void> {
    this.modalService.loading("Cargando Turnos");
    try {
      this.workday = await this.workdayService.getWorkdayByDate(this.date.toISOString().split('T')[0]);

      this.initializeDataTable();
    } catch (error) {
      console.error(error);
    }
    this.modalService.loadingClose();
  }

//region tabla de turnos
initializeDataTable(): void {
  const tableElement = document.getElementById('appointmentTable') as HTMLTableElement;
  if (tableElement && this.workday?.appointment) {
    if (this.table) {
      this.table.destroy();
    }
    this.table = new DataTable(tableElement, {
      searching: false,
      ordering: true,
      paging: false,
      info: false,
      data: this.workday.appointment.map((appointment) => ({
        id: appointment.id,
        startTime: appointment.appointmentTimes?.startTime ?? 'N/A',
        state: appointment.state?.name ?? 'Sin estado'
      })),
      columns: [
        { title: "Hora", data: 'startTime' },
        { title: "Estado", data: 'state' },
        { title: "Acciones", data: 'id', render: (data: any) => {
            return `<button class="btn btn-primary edit-reservation" data-reservation='${data}'>
                      <i class="bi bi-ticket-detailed"></i>
                    </button>`;
          }
        }
      ],
      createdRow: (row: Node, data: any) => {
        if (data.state === 'defeated') {
          (row as HTMLElement).classList.add('table-danger');
        } else if(data.state === 'reserved'){
          (row as HTMLElement).classList.add('table-success');
        } else if(data.state === 'finish'){
          (row as HTMLElement).classList.add('table-primary');
        } else if(data.state === 'disabled'){
          (row as HTMLElement).classList.add('table-dark');
        }
      }
    });

    // Delegar eventos de click en el contenedor de la tabla
    $('#appointmentTable').off('click', '.edit-reservation');
    $('#appointmentTable').on('click', '.edit-reservation', (event) => {
      const appointment = JSON.parse(
        (event.currentTarget as HTMLElement).getAttribute('data-reservation')!
      );
      this.reservationSelected(appointment);
    });
  }
}

  async tableRight(){
    this.modalService.loading("Cargando Turnos");
    this.date.setDate(this.date.getDate() + 1);
    try {
      this.workday = await this.workdayService.getWorkdayByDate(this.date.toISOString().split('T')[0]);
      this.initializeDataTable();
    } catch (error) {
      console.error(error);
    }
    this.modalService.loadingClose();
  }

  async tableLeft(){
    this.modalService.loading("Cargando Turnos");
    this.date.setDate(this.date.getDate() - 1);
    try {
      this.workday = await this.workdayService.getWorkdayByDate(this.date.toISOString().split('T')[0]);
      this.initializeDataTable();
    } catch (error) {
      console.error(error);
    }
    this.modalService.loadingClose();
  }

  async reservationSelected(idAppointment: number){
    this.modalService.loading("Cargando Reserva");
    const reservation = await this.reservationService.getReservationByAppointment(idAppointment);
    this.modalService.formReservation(reservation, this.date.toISOString().split('T')[0]);
    this.modalService.loadingClose();
  }

  //endregion


}
