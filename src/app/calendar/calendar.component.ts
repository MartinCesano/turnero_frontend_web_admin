import { Component, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
// #region declaracion variables
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  today: Date = new Date();

  month: number = this.today.getMonth(); // actual
  year: number = this.today.getFullYear(); // actual

  currentMonth: number = this.month; //de la pantalla
  currentYear: number = this.year; // de la pantalla
  selectedDay: number | null = null;// de la pantalla

  monthYear: string = '';  // Inicializamos la propiedad
  weeks: (number | null)[][] = [];  // Permitir valores null

  futureDate = this.today.getDate() + 14;

  arrayDaysAvaible: number[] = [];


  @Input() avaibleSchedule: {day:string, id:string}[] | null = null; //dias desabilitados

  constructor() { }
// #endregion declaracion variables


// #region funciones de inicializacion
  ngOnInit(): void { //es lo primero que se ejecuta
    //debera buscar los dias desabilitados
    this.renderCalendar(this.currentMonth, this.currentYear);
    this.selectedDay = this.today.getDate();
    this.getDayAvaible();//consigue los dias avilitados
  }

  renderCalendar(month: number, year: number): void { //renderiza el calendario
    this.weeks = [];
    const firstDay = new Date(year, month).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();
    this.monthYear = `${this.monthNames[month]} ${year}`;

    let date = 1;
    for (let i = 0; i < 6; i++) {
      const week: (number | null)[] = [];  // Permitir valores null
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(null);
        } else if (date > daysInMonth) {
          week.push(null);
        } else {
          week.push(date);
          date++;
        }
      }
      this.weeks.push(week);
    }
  }
// #endregion funciones de inicializacion


// #region funciones de logica
  previousMonth(): void {// cambia el mes y renderiza el calendario nuevamente
    this.currentYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
    this.renderCalendar(this.currentMonth, this.currentYear);
  }
  nextMonth(): void { // cambia el mes y renderiza el calendario nuevamente
    this.currentYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
    this.renderCalendar(this.currentMonth, this.currentYear);
  }

  isDisabledDay(day: number | null): boolean { //se encarga de saber si esta desabilitado el dia
    if (day === null) { 
      return false; 
    }else{
      if(this.year > this.currentYear || this.year== this.currentYear && this.month > this.currentMonth ||  this.year== this.currentYear && this.month == this.currentMonth && this.today.getDate() > day || !this.arrayDaysAvaible.includes(day ?? 0)){ //si el año es mayor al actual
      return true;
      }
      return false; 
    }
  }

  isBlockedFuruteDay(day: number | null): boolean { //se encarga de saber si esta desabilitado el dia
    if (day === null) { 
      return false; 
    }else{
      if(this.year < this.currentYear || this.year == this.currentYear && this.month < this.currentMonth ||  this.year== this.currentYear && this.month == this.currentMonth && this.futureDate <= day){ 
      return true;
    }
      return false; 
    }
  }

  canSelectDay(day: number | null): boolean {
    if (day === null) { 
      return false; 
    }
    if(this.arrayDaysAvaible.includes(day ?? 0)){
      if(!(this.year < this.currentYear || this.year == this.currentYear && this.month < this.currentMonth ||  this.year== this.currentYear && this.month == this.currentMonth && this.futureDate <= day || this.year > this.currentYear || this.year== this.currentYear && this.month > this.currentMonth ||  this.year== this.currentYear && this.month == this.currentMonth && this.today.getDate() > day || !this.arrayDaysAvaible.includes(day ?? 0))){ 
        if(this.selectedDay == day){
        return true;
        }
      }
    }
    return false;
  }


  getDayAvaible() : void{ //verifico si el dia esta disponible
    this.arrayDaysAvaible = [];
    if (this.avaibleSchedule) {
      for (let day of this.avaibleSchedule) {
        this.arrayDaysAvaible.push(parseInt(day.day));
      }
    }
  }

  findDayId(day: number | null) { //busca el id del dia
    if (this.avaibleSchedule) {
      for (let dayAvaible of this.avaibleSchedule) {
        if (parseInt(dayAvaible.day) == day) {
          return dayAvaible.id;
        }
      }
    }
    return null;
  }

  @Output() setDaySelected: EventEmitter<any> = new EventEmitter();
  selectDay(day: number | null): void { //selecciona el dia
    this.selectedDay = day;
    const fecha: string = day+"/"+(this.currentMonth+1)+"/"+this.currentYear;
    //logica para pasar el dia seleccionado a el componente padre
    this.setDaySelected.emit({ id: this.findDayId(day), date:fecha }); //se manda esto al padre como un evento
  }

// #endregion funciones de logica

}
