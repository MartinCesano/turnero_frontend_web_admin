// src/interfaces/reservation.interface.ts
import { ICustomer } from './customer.interface';
import { IAppointment } from './appointment.interface';
import { IState } from './state.interface';
import { ICancellationDetail } from './cancellation-detail.interface';
import { IDebt } from './debt.interface';

export interface IReservation {
  id: number;
  notification: boolean;
  customer: ICustomer;
  appointment: IAppointment | null;
  state: IState;
  cancellationDetail: ICancellationDetail | null;
  debt: IDebt[];
}
