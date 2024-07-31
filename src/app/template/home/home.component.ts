import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../components/modals/modal.service';
import { WorkdayService } from '../../core/services/workday.service';

import DataTable from 'datatables.net-dt';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  workday: any;
  table: any;

  constructor(
    private modalService: ModalService,
    private workdayService: WorkdayService
  ) { }

  async ngOnInit(): Promise<void> {
    this.modalService.loading("cargando Turnos");
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato 'YYYY-MM-DD'
      this.workday = await this.workdayService.getWorkdayByDate(currentDate);

      this.initializeDataTable();
    } catch (error) {
      console.error(error);
    }
    this.modalService.loadingClose();
}



  //region tabla de turnos
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
        data: this.workday.appointment.map((appointment: any) => [
          appointment.appointmentTimes.startTime,
          appointment.state.name
        ]),
        columns: [
          { title: "Hora" },
          { title: "Estado" },
        ],
      });
    }
  }
  //endregion



  

}
