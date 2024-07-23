import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../components/modals/modal.service';
import { backendUrl } from './api-environments';


@Injectable({
  providedIn: 'root'
})
export class WorkdayService {

  constructor(private modalService: ModalService) { }
  getWorkdays(): any {
    try {
      return axios.get(`${backendUrl}/workday`);
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
  getWorkdayByDate(date: string): any {
    try {
      return axios.get(`${backendUrl}/workday/${date}`);
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
