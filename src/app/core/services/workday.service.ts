import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../components/modals/modal.service';
import { backendUrl } from './api-environments';
import { ApplyScheduleDto } from '../../interfaces/workday/apply-schedule.dto';


@Injectable({
  providedIn: 'root'
})
export class WorkdayService {

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


    updateWorkday(id: number, workday: any): any {
      try {
        return axios.put(`${backendUrl}/workday/${id}`, workday, {
          headers: { Authorization: `Bearer ${this.getAccessToken()}` }
        });
      } catch (error) {
        this.modalService.openMenssageTypes({
          text: "Error al actualizar el dia.",
          subtitle: (error as any).response.data.message,
          backendUrl: null,
          type: "error"
        })
        throw new HttpErrorResponse({ error });
      }
    }
    

    async getWorkdays(): Promise<any> {
      try {
        const response = await axios.get(`${backendUrl}/workday`,{
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`
          }
        });
        return response.data;  // Devuelve solo los datos de la respuesta
      } catch (error) {
        this.modalService.openMenssageTypes({
          text: "Error en la obtencion de los dias.",
          subtitle: (error as any).response.data.message,
          backendUrl: null,
          type: "error"
        })
        throw new HttpErrorResponse({ error });
      }
    }

    
  async getWorkdayByDate(date: string): Promise<any> {
    try {
      const response = await axios.get(`${backendUrl}/workday/${date}`,{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en la obtencion de las horas.",
        subtitle: (error as any).response.data.message,
        backendUrl: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async applySchedule(schedule: ApplyScheduleDto): Promise<any> {
    try {
      const response = await axios.post(`${backendUrl}/workday/applySchedule`,schedule,{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en la obtencion de las horas.",
        subtitle: (error as any).response.data.message,
        backendUrl: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

}
