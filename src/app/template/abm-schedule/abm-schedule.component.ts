import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../core/services/schedule.service';
import { ModalService } from '../../components/modals/modal.service';

export interface AppointmentTime {
  id: number;
  startTime: string; // Ajusta el tipo según sea necesario, por ejemplo, Date
}

export interface Schedule {
  id: number;
  name: string;
  appointmentTimes: AppointmentTime[];
}

@Component({
  selector: 'app-abm-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-schedule.component.html',
  styleUrls: ['./abm-schedule.component.css'] // Asegúrate de usar `styleUrls` en plural
})
export class AbmScheduleComponent implements OnInit {
  schedules: any[] = []; // Inicializa como un array vacío
  selectedSchedule: any;

  constructor(private scheduleService: ScheduleService, private modalService: ModalService) { }

  ngOnInit() {
    console.log('AbmScheduleComponent initialized');
    this.getSchedules();

  }

  async getSchedules() {
    try {
      this.schedules = await this.scheduleService.getSchedules();
      console.log('Schedules retrieved:', this.schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  }

  async addSchedule(schedule: any) {
    await this.modalService.formSchedule(schedule);
    this.getSchedules();
}

  async deleteSchedule(schedule: any) {
    await this.scheduleService.deleteSchedule(schedule.id)
    this.getSchedules();
  }

  
}