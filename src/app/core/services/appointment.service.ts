import { Injectable } from '@angular/core';
import { backendUrl } from './api-environments';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

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

}
