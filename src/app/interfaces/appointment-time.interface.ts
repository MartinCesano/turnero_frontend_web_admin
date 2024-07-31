// src/interfaces/appointment-time.interface.ts
import { ISchedule } from './schedule.interface';
import { IAppointment } from './appointment.interface';

export interface IAppointmentTime {
  id: number;
  startTime: string;
  endTime: string;
  schedule: ISchedule[];
  appointment: IAppointment[];
}
