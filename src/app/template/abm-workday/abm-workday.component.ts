import { Component } from '@angular/core';
import { CalendarComponent } from "../../calendar/calendar.component";

@Component({
  selector: 'app-abm-workday',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './abm-workday.component.html',
  styleUrl: './abm-workday.component.css'
})
export class AbmWorkdayComponent {

}
