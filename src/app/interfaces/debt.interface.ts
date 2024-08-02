// src/interfaces/debt.interface.ts
import { IReservation } from './reservation.interface';

export interface IDebt {
  id: number;
  price: number;
  paid: boolean;
  paymentDate: Date;
  reservation: IReservation | null;
}
