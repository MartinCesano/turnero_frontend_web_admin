import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { backendUrl } from './api-environments';
import { ModalService } from '../../components/modals/modal.service';
import { ISchedule } from '../../interfaces/schedule.interface';
import { IScheduleNew } from '../../interfaces/schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

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

  async getSchedules(): Promise<ISchedule[]> {
    try {
      const response = await axios.get(`${backendUrl}/schedule`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({
        text: "Error en la obtencion de los horarios.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async createSchedule(data: IScheduleNew): Promise<ISchedule> {
    try {
      const response = await axios.post(`${backendUrl}/schedule`, data, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({
        text: "Error en la creación de un horario.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }
  async deleteSchedule(id: number): Promise<void> {
    try {
        const token = await this.getAccessToken();
        await axios.delete(`${backendUrl}/schedule/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        this.modalService.openMenssageTypes({
            text: "Horario eliminado correctamente.",
            subtitle: null,
            url: null,
            type: "success"
        });
    } catch (error) {
      this.modalService.loadingClose();
        const errorMessage = (error as any).response?.data?.message || "Error desconocido";
        this.modalService.openMenssageTypes({
            text: "Error en la eliminación de un horario.",
            subtitle: errorMessage,
            url: null,
            type: "error"
        });
        throw error; // Propaga el error para que el componente pueda manejarlo
    }
}

  async updateSchedule(id: number, schedule: ISchedule): Promise<ISchedule> {
    try {
      const response = await axios.put(`${backendUrl}/schedule/${id}`, schedule, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({
        text: "Error en la actualizacion de los horarios.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

}
