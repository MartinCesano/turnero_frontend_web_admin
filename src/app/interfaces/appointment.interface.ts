// src/interfaces/appointment.interface.ts
import { IAppointmentTime } from './appointment-time.interface';
import { IWorkday } from './workday.interface';
import { IReservation } from './reservation.interface';
import { IState } from './state.interface';

export interface IAppointment {
  id: number;
  appointmentTimes: IAppointmentTime;
  workday: IWorkday;
  reservation?: IReservation;
  state: IState;
}

export interface IAppointmentNew {
  appointmentTimes: IAppointmentTime;
  workday: IWorkday;
  reservation?: IReservation;
  state: IState;
}
