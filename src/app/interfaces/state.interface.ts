// src/interfaces/state.interface.ts
import { IAppointment } from './appointment.interface';
import { IReservation } from './reservation.interface';
export interface IState {
    id: number;
    name: string;
    description: string;
    scope: string;
    appointment?: IAppointment[];  // Si es necesario, se puede definir la interfaz IAppointment
    reservation?: IReservation[];  // Si es necesario, se puede definir la interfaz IReservation
  }
  