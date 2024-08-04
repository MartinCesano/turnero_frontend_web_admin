import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { backendUrl } from './api-environments';
import { ModalService } from '../../components/modals/modal.service';
import { IReservation } from '../../interfaces/reservation.interface';
import { IState } from '../../interfaces/state.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private modalService: ModalService) { }

    // Método para obtener el token almacenado en el localStorage
    private getAccessToken(): string | null {
      const token = localStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        return parsedToken.accessToken || null;
      }
      return null;
    }

  async getReservation(): Promise<IReservation[]> {
    try {
      const response = await axios.get(`${backendUrl}/reservation`,{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({
        text: "Error en la obtencion de las reservas.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async getReservationByAppointment(idAppointment: number): Promise<IReservation> {
    try {
      const response = await axios.get(`${backendUrl}/reservation/byAppointment/${idAppointment}`,{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({
        text: "Error en la obtencion de las reservas.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async changeState(idReservation: number, state: IState): Promise<IReservation> {
    try {
      const response = await axios.post(`${backendUrl}/reservation/changeState`,{
        idReservation,
        state
      },{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({
        text: "Error al cambiar el estado de la reserva.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }




}
