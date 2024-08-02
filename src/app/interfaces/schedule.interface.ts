// src/interfaces/schedule.interface.ts
import { IAppointmentTime } from "./appointment-time.interface";
import { IWorkday } from './workday.interface';

export interface ISchedule {
  id: number;
  name: string;
  appointmentTimes?: IAppointmentTime[];
}

export interface IScheduleNew {
  name: string;
  appointmentTimes?: IAppointmentTime[];
}
