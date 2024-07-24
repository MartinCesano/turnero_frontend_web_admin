import { Injectable } from '@angular/core';
import { backendUrl } from './api-environments';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../components/modals/modal.service';



@Injectable({
  providedIn: 'root'
})
export class AppointmentTimeService {

  constructor(private modalService: ModalService) { }
  
  async getAppointmentTimes(): Promise<any> {
    try {
      const response = await axios.get(`${backendUrl}/appointment-time`);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en la obtencion de las horas.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async createAppointmentTime(appointmentTime: any): Promise<any> {
    try {
      const response = await axios.post(`${backendUrl}/appointment-time/`, appointmentTime);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error al crear una hora.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async updateAppointmentTime(appointmentTime: any): Promise<any> {
    try {
      const response = await axios.put(`${backendUrl}/appointment-time/${appointmentTime.id}`, appointmentTime);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en actualizar una hora.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async deleteAppointmentTime(id: number): Promise<any> {
    try {
      const response = await axios.delete(`${backendUrl}/appointment-time/${id}`);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error borrar una hora.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }
}
