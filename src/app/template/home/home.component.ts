import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../components/modals/modal.service';
import { WorkdayService } from '../../core/services/workday.service';
import DataTable from 'datatables.net-dt';
import { IWorkday } from '../../interfaces/workday.interface';

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
    private workdayService: WorkdayService
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
  //endregion


}
