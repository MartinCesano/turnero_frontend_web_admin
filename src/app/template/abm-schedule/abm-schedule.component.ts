import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Import the OnInit interface
import { ApiService } from '../../core/services/api.service';
export interface AppointmentTime {
  id: number;
  startTime: string;  // Ajusta el tipo según sea necesario, por ejemplo, Date
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
  styleUrl: './abm-schedule.component.css'
})
export class AbmScheduleComponent implements OnInit {
   schedules:any;  // Inicializa como un array vacío

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    console.log('AbmScheduleComponent initialized');
    this.getSchedules();
  }

  async getSchedules() {
    try {
      this.schedules = await this.apiService.getSchedules();
      console.log('Schedules retrieved:', this.schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  }
}