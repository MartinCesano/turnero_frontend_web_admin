// src/interfaces/workday.interface.ts
import { IAppointment } from './appointment.interface';  // Asegúrate de tener esta interfaz
import { ISchedule } from './schedule.interface';  // Asegúrate de tener esta interfaz

export interface IWorkday {
  id: number;
  date: Date;
  close: boolean;
  appointment: IAppointment[];
  schedule: ISchedule;
}
