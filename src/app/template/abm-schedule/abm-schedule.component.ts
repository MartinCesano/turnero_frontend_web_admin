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
  {
    id: 1,
    name: 'Día Normal',
    appointmentTimes: [
      { id: 1, startTime: "08:00" },
      { id: 2, startTime: "08:30" },
      { id: 3, startTime: "09:00" },
      { id: 4, startTime: "09:30" },
      { id: 5, startTime: "10:00" },
      { id: 6, startTime: "10:30" },
      { id: 7, startTime: "11:00" },
      { id: 8, startTime: "11:30" },
      { id: 9, startTime: "14:00" },
      { id: 10, startTime: "14:30" },
      { id: 11, startTime: "15:00" },
      { id: 12, startTime: "15:30" },
      { id: 13, startTime: "16:00" },
      { id: 14, startTime: "16:30" },
      { id: 15, startTime: "17:00" },
      { id: 16, startTime: "17:30" },
      { id: 17, startTime: "18:00" },
      { id: 18, startTime: "18:30" },
      { id: 19, startTime: "19:00" },
      { id: 20, startTime: "19:30" }
    ]
  },
  {
    id: 2,
    name: 'Día Solo Mañana',
    appointmentTimes: [
      { id: 1, startTime: "08:00" },
      { id: 2, startTime: "08:30" },
      { id: 3, startTime: "09:00" },
      { id: 4, startTime: "09:30" },
      { id: 5, startTime: "10:00" },
      { id: 6, startTime: "10:30" },
      { id: 7, startTime: "11:00" },
      { id: 8, startTime: "11:30" }
    ]
  },
  {
    id: 3,
    name: 'Día Solo Tarde',
    appointmentTimes: [
      { id: 1, startTime: "14:00" },
      { id: 2, startTime: "14:30" },
      { id: 3, startTime: "15:00" },
      { id: 4, startTime: "15:30" },
      { id: 5, startTime: "16:00" },
      { id: 6, startTime: "16:30" },
      { id: 7, startTime: "17:00" },
      { id: 8, startTime: "17:30" },
      { id: 9, startTime: "18:00" },
      { id: 10, startTime: "18:30" },
      { id: 11, startTime: "19:00" },
      { id: 12, startTime: "19:30" }
    ]
  },
  {
    id: 4,
    name: 'Día Personalizado 1',
    appointmentTimes: [
      { id: 1, startTime: "08:00" },
      { id: 2, startTime: "08:30" },
      { id: 3, startTime: "09:30" },  // Se omite 09:00
      { id: 4, startTime: "10:00" },
      { id: 5, startTime: "10:30" },
      { id: 6, startTime: "11:00" },
      { id: 7, startTime: "11:30" },
      { id: 8, startTime: "14:00" },
      { id: 9, startTime: "14:30" },
      { id: 10, startTime: "15:30" },  // Se omite 15:00
      { id: 11, startTime: "16:00" },
      { id: 12, startTime: "16:30" },
      { id: 13, startTime: "17:00" },
      { id: 14, startTime: "17:30" },
      { id: 15, startTime: "18:30" },  // Se omite 18:00
      { id: 16, startTime: "19:30" }   // Se omite 19:00
    ]}
];

  NgOnInit() {
    console.log('AbmScheduleComponent');
  }
  NgFor() { 

  } 




}
