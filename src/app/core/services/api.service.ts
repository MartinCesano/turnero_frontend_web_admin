import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'http://localhost:3001';

  constructor() {}

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



}
