import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'https://qngrq6tj-3000.brs.devtunnels.ms';

  constructor() { }

  // Método para obtener el token almacenado en el localStorage
  private getAccessToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const parsedToken = JSON.parse(token);
      return parsedToken.accessToken || null;
    }
    return null;
  }

  // Método para obtener productos con autenticación
  async getProducts(): Promise<any> {
    try {
      const accessToken = this.getAccessToken();
      console.log(accessToken);
      if (!accessToken) {
        throw new HttpErrorResponse({
          error: 'No access token found',
          status: 401,
          statusText: 'Unauthorized'
        });
      }
      return (await axios.get(`${this.url}/products/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })).data;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async getProductById(id: number): Promise<any> {
    try {
      const response = await axios.get(`${this.url}/products/${id}`);
      return response.data; // Asegúrate de retornar los datos aquí
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async updateProductById(id: number, product: any): Promise<any> {
    try {
      axios.put(`${this.url}/products/${id}`, product)
        .then((productById) => {
          console.log(productById);
        })
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async createProduct(product: any): Promise<any> {
    try {
      axios.post(`${this.url}/products/`, product)
        .then((product) => {
          console.log(product);
          return product;
        })
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async deleteProductById(id: number): Promise<any> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new HttpErrorResponse({
          error: 'No access token found',
          status: 401,
          statusText: 'Unauthorized'
        });
      }
      return (await axios.delete(`${this.url}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })).data;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async getProductTypes(): Promise<any> {
    try {
      const accessToken = this.getAccessToken();
      console.log(accessToken);
      if (!accessToken) {
        throw new HttpErrorResponse({
          error: 'No access token found',
          status: 401,
          statusText: 'Unauthorized'
        });
      }
      return (await axios.get(`${this.url}/product-types/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })).data;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  getWorkdays(): any {
    return axios.get(`${this.url}/workday`);
  }
  getWorkdayByDate(date: string): any {
    return axios.get(`${this.url}/workday/${date}`);
  }

  async getSchedules(): Promise<any> {
    try {
      const response = await axios.get(`${this.url}/schedule`);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;  // Vuelve a lanzar el error para que pueda ser manejado en el componente
    }
  }

  async getAppointmentTimes(): Promise<any> {
    try {
      const response = await axios.get(`${this.url}/appointment-time`);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      console.error('Error fetching appointment times:', error);
      throw error;  // Vuelve a lanzar el error para que pueda ser manejado en el componente
    }
  }

  async createAppointmentTime(appointmentTime: any): Promise<any> {
    try {
      const response = await axios.post(`${this.url}/appointment-time/`, appointmentTime);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      console.error('Error creating appointment time:', error);
      throw error;  // Vuelve a lanzar el error para que pueda ser manejado en el componente
    }
  }



  async updateAppointmentTime(appointmentTime: any): Promise<any> {
    try {
      const response = await axios.put(`${this.url}/appointment-time/${appointmentTime.id}`, appointmentTime);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      console.error('Error updating appointment time:', error);
      throw error;  // Vuelve a lanzar el error para que pueda ser manejado en el componente
    }
  }

  async deleteAppointmentTime(id: number): Promise<any> {
    try {
      const response = await axios.delete(`${this.url}/appointment-time/${id}`);
      return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
      console.error('Error deleting appointment time:', error);
      throw error;  // Vuelve a lanzar el error para que pueda ser manejado en el componente
    }
  }
}


