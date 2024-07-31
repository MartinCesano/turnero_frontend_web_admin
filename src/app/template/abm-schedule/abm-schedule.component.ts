import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../core/services/schedule.service';
import { ModalService } from '../../components/modals/modal.service';
import { IAppointmentTime } from '../../interfaces/appointment-time.interface';
import { ISchedule } from '../../interfaces/schedule.interface';

@Component({
  selector: 'app-abm-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-schedule.component.html',
  styleUrls: ['./abm-schedule.component.css'] // Asegúrate de usar `styleUrls` en plural
})
export class AbmScheduleComponent implements OnInit {
  
  schedules: ISchedule[] = []; // Inicializa como un array vacío
  selectedSchedule?: ISchedule;

  constructor(private scheduleService: ScheduleService, private modalService: ModalService) { }

  ngOnInit() {
    this.modalService.loading("Cargando horas")
    this.getSchedules();
  }


  async getSchedules() {
    try {
      const schedules = await this.scheduleService.getSchedules();
      // Ordena los appointmentTimes dentro de cada schedule
      schedules.forEach((schedule: ISchedule) => {
        // Verifica si appointmentTimes existe y es un array
        if (schedule.appointmentTimes) {
          schedule.appointmentTimes.sort((a: IAppointmentTime, b: IAppointmentTime) => a.startTime.localeCompare(b.startTime));
        }
      });

      // Ordena los schedules por nombre
      this.schedules = schedules.sort((a: ISchedule, b: ISchedule) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
    this.modalService.loadingClose();
  }

  async addSchedule(schedule: ISchedule) {
    await this.modalService.formSchedule(schedule);
    this.getSchedules();
  }

  async deleteSchedule(schedule: ISchedule) {
    await this.scheduleService.deleteSchedule(schedule.id)
    this.getSchedules();
  }


}