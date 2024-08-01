// src/interfaces/workday.interface.ts
import { IAppointment } from './appointment.interface';  // Asegúrate de tener esta interfaz
import { ISchedule } from './schedule.interface';  // Asegúrate de tener esta interfaz
import { IAppointmentTime } from './appointment-time.interface';  // Asegúrate de tener esta interfaz

export interface IWorkday {
  id: number;
  date: Date;
  close: boolean;
  appointment: IAppointment[];
  schedule: ISchedule;
}

export interface IApplySchedule {
  startDate: string;
  endDate: string;
  appointmentTimes?: IAppointmentTime[];
  applyDays: string[];
}
