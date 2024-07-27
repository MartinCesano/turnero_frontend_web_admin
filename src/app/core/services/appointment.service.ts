import { Injectable } from '@angular/core';
import { backendUrl } from './api-environments';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../components/modals/modal.service';

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


async getAppointments(): Promise<any> {
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


async createAppointment(appointment: any): Promise<any> {
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

async deleteAppointment(ids: number[]): Promise<any> {
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



}
