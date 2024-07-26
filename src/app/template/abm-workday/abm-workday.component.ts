import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output,  Input } from '@angular/core';
import { WorkdayService } from '../../core/services/workday.service';
import { ModalService } from '../../components/modals/modal.service';
@Component({
  selector: 'app-abm-workday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-workday.component.html',
  styleUrl: './abm-workday.component.css'
})
export class AbmWorkdayComponent implements OnInit {
  
constructor(private workdayService: WorkdayService, private modalService: ModalService) { }
// #endregion declaracion variables


// #region declaracion variables
monthNames: string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Nobiembre', 'Diciembre'
];
today: Date = new Date();

month: number = this.today.getMonth(); // actual
year: number = this.today.getFullYear(); // actual

currentMonth: number = this.month; //de la pantalla
currentYear: number = this.year; // de la pantalla
selectedDay: number | null = null;// de la pantalla
selectedDayObject : any = null;
selectedDayDate: string = '';
monthYear: string = '';  // Inicializamos la propiedad
weeks: (number | null)[][] = [];  // Permitir valores null

futureDate = this.today.getDate() + 14;

arrayDaysAvaible: number[] = [];


appoinments=  [
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
];


@Input() avaibleSchedule: {day:string, id:string}[] | null = null; //dias desabilitados

workdays = [];
// #region funciones de inicializacion
ngOnInit(): void { //es lo primero que se ejecuta
  this.getWorkdays();
  this.renderCalendar(this.currentMonth, this.currentYear);
  this.selectedDay = this.today.getDate();
 //consigue los dias avilitados

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
  //comparamos las fechas del calendario con las del backend
  //acaaaaaaaaaaaaaaaaaaaaaaaaaaa
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

getWorkdays(): void { //consigue los dias
  this.workdays = this.workdayService.getWorkdays()
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

async selectWorkday(workday: number | null): Promise<void> {
  this.selectedDay = workday;
  const fecha: string = this.formatDateToView(this.currentYear, this.currentMonth + 1, workday ?? 0);

  this.modalService.formWorkday(fecha);
  

  //this.selectedDayObject = await this.workdayService.getWorkdayByDate(fecha);
  //this.selectedDayDate = fecha;
}

private formatDateToView(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  return date.toISOString().split('T')[0]; // Devuelve la fecha en formato YYYY-MM-DD
}


// Aquí debes tener un método para obtener los horarios del workday



// #endregion funciones de logica

//#region funciones auxiliares

 padToTwoDigits(number: number): string {
  return number.toString().padStart(2, '0');
}

 formatDate(year: number, month: number, day : number): string {
  return year + "-" + this.padToTwoDigits(month) + "-" + this.padToTwoDigits(day);
}

//endregion

}
