import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../components/modals/modal.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'https://qngrq6tj-3000.brs.devtunnels.ms';
  //url = 'http://localhost:3000';

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

  getWorkdays(): any {
    try {
      return axios.get(`${this.url}/workday`);
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en la obtencion de los dias.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }
  getWorkdayByDate(date: string): any {
    try {
      return axios.get(`${this.url}/workday/${date}`);
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

  async getSchedules(): Promise<any> {
    try {
      const response = await axios.get(`${this.url}/schedule`);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en la obtencion de los horarios.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async getAppointmentTimes(): Promise<any> {
    try {
      const response = await axios.get(`${this.url}/appointment-time`);
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
      const response = await axios.post(`${this.url}/appointment-time/`, appointmentTime);
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
      const response = await axios.put(`${this.url}/appointment-time/${appointmentTime.id}`, appointmentTime);
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
      const response = await axios.delete(`${this.url}/appointment-time/${id}`);
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


