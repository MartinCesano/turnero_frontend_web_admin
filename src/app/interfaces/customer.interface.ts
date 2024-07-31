// src/interfaces/customer.interface.ts
import { IReservation } from './reservation.interface';

export interface ICustomer {
  document: number;
  name: string;
  lastname: string;
  phone: number;
  birthdate?: string;
  blacklisted: boolean;
  reservation: IReservation[];
}
