import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { backendUrl } from './api-environments';
import { ModalService } from '../../components/modals/modal.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private modalService: ModalService) { }

  async getCustomers(): Promise<any> {
    try {
      const response = await axios.get(`${backendUrl}/customer`);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en los clientes.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

}
