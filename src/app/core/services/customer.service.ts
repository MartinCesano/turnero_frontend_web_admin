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

    // Método para obtener el token almacenado en el localStorage
    private getAccessToken(): string | null {
      const token = localStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        return parsedToken.accessToken || null;
      }
      return null;
    }

  async getCustomers(): Promise<any> {
    try {
      const response = await axios.get(`${backendUrl}/customer`,{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
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

  async createCustomer(customer: any): Promise<any> {
    try{
        const response = await axios.post(`${backendUrl}/customer/register`, customer);
        return response.data;
    }catch(error){
        this.modalService.openMenssageTypes({
            text:"Error en el Registro",
            subtitle: (error as any).response.data.message,
            url:null,
            type:"error"
        })
        throw new HttpErrorResponse({ error });
    }
}

  async deleteCustomer(document: any): Promise<any> {
    try {
      const response = await axios.delete(`${backendUrl}/customer/${document}`,{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en borrar un cliente.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }



  async updateCustomer(document: number, customer: any): Promise<any> {
    try {
      const response = await axios.put(`${backendUrl}/customer/${document}`,customer,{
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error en editar un cliente.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  




}
