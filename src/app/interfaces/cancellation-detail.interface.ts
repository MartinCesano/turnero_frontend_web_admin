import { IAppointment } from './appointment.interface'; 
import { IReservation } from './reservation.interface'; 

export interface ICancellationDetail {
  id: number;
  description: number;
  cancellationDate: string;
  appointment: IAppointment; 
  reservation: IReservation; 
}