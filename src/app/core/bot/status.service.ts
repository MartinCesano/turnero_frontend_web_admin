import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../components/modals/modal.service';
//import { backendUrl } from './api-environments';
import { BotStatus } from '../../interfaces/bot.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
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



  async getStatus(): Promise<BotStatus> {
    try {
      const response = await axios.get(`http://localhost:3002/v1/status`,{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.loadingClose();
      this.modalService.openMenssageTypes({
        text: "Error en obtener el estado del bot.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }


}


