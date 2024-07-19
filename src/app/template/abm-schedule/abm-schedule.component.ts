import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-abm-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-schedule.component.html',
  styleUrl: './abm-schedule.component.css'
})
export class AbmScheduleComponent {
  schedules = [
    { id: 1, name: 'Schedule 1', appointmentTimes: [{id:1,startTime : "08:30"},{id:2,startTime : "09:30"},{id:3,startTime : "10:30"}] },
    { id: 2, name: 'Schedule 2', appointmentTimes: [{id:1,startTime : "08:30"},{id:2,startTime : "09:30"},{id:3,startTime : "10:30"}] },
    { id: 3, name: 'Schedule 3', appointmentTimes: [{id:1,startTime : "08:30"},{id:2,startTime : "09:30"},{id:3,startTime : "10:30"}] },
    { id: 4, name: 'Schedule 4', appointmentTimes: [{id:1,startTime : "08:30"},{id:2,startTime : "09:30"},{id:3,startTime : "10:30"}] },
    { id: 5, name: 'Schedule 5', appointmentTimes: [{id:1,startTime : "08:30"},{id:2,startTime : "09:30"},{id:3,startTime : "10:30"}] },
    { id: 6, name: 'Schedule 6', appointmentTimes: [{id:1,startTime : "08:30"},{id:2,startTime : "09:30"},{id:3,startTime : "10:30"}] },
    { id: 7, name: 'Schedule 7', appointmentTimes: [{id:1,startTime : "08:30"},{id:2,startTime : "09:30"},{id:3,startTime : "10:30"}] },
  ]; 
  NgOnInit() {
    console.log('AbmScheduleComponent');
  }
  NgFor() { 

  } 




}
