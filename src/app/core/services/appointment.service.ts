import { Injectable } from '@angular/core';
import { backendUrl } from './api-environments';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../components/modals/modal.service';
import { IAppointment } from '../../interfaces/appointment.interface';
import { IAppointmentNew } from '../../interfaces/appointment.interface';
import { IState } from '../../interfaces/state.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private modalService:ModalService) { }

    // Método para obtener el token almacenado en el localStorage
    private getAccessToken(): string | null {
      const token = localStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        return parsedToken.accessToken || null;
      }
      return null;
    }


async getAppointments(): Promise<IAppointment> {
  try {
    const response = await axios.get(`${backendUrl}/appointment`, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    });
    return response.data;  // Devuelve solo los datos de la respuesta
  } catch (error) {
    this.modalService.openMenssageTypes({
      text: "Error en la obtencion de los turnos.",
      subtitle: (error as any).response.data.message,
      url: null,
      type: "error"
    })
    throw new HttpErrorResponse({ error });
  }
}


async createAppointment(appointment: IAppointmentNew[] ): Promise<IAppointment> {
  try {
    const response = await axios.post(`${backendUrl}/appointment`, appointment, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    });
    return response.data;
  } catch (error) {
    this.modalService.openMenssageTypes({
      text: "Error en la agregar el turno.",
      subtitle: (error as any).response.data.message,
      url: null,
      type: "error"
    })
    throw new HttpErrorResponse({ error });
  }
}

async disabledAppointment(ids: number[]): Promise<IAppointment> {
  try {
    const response = await axios.delete(`${backendUrl}/appointment`, {
      data: {"ids":ids},
      headers: { Authorization: `Bearer ${this.getAccessToken()}` }
    });
    return response.data;
  } catch (error) {
    this.modalService.openMenssageTypes({
      text: "Error al eliminar sacar el turno.",
      subtitle: (error as any).response.data.message,
      url: null,
      type: "error"
    })
    throw new HttpErrorResponse({ error });
  }
}


async changeStatusMany(appointments: IAppointment[], state: IState): Promise<IAppointment> {
  try {
    const response = await axios.post(`${backendUrl}/appointment/avaible-appointment`, {appointments, state}, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    });
    return response.data;
  } catch (error) {
    this.modalService.openMenssageTypes({
      text: "Error al cambiar el habilitar turnos.",
      subtitle: (error as any).response.data.message,
      url: null,
      type: "error"
    })
    throw new HttpErrorResponse({ error });
  }
}


}
