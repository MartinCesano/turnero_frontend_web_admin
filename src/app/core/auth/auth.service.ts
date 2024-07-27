import { Injectable } from '@angular/core';
import axios from 'axios';
import { LoginI, RegisterI, TokenI } from '../../interfaces/token';
import { HttpErrorResponse } from '@angular/common/http';
import { timer } from 'rxjs';
import moment from 'moment';
import { backendUsersUrl } from './auth-environments';
import { ModalService } from '../../components/modals/modal.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private modalService: ModalService) {}

  async login(body: LoginI): Promise<TokenI> {
    try {
      const response = (await axios.post(`${backendUsersUrl}/login`, body)).data;
      localStorage.setItem('token', JSON.stringify(response));
      this.scheduleTokenRefresh(response.expirationTime); // Esto es para ejecutar la función de refreshToken
      return response;
    }  catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error al iniciar sesion.",
        subtitle: null,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  async register(body: RegisterI): Promise<void> {
    try {
      return (await axios.post(`${backendUsersUrl}/register`, body)).data;
    }  catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error al registrarse.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
  }
}

  async refreshToken() {
    const tokenObject = JSON.parse(localStorage.getItem('token') ?? '{"refreshToken":""}');
    try {
      const response = (
        await axios.get(`${backendUsersUrl}/refresh`, {
          headers: {
            'refresh-token': tokenObject.refreshToken,
          },
        })
      ).data;
      tokenObject.accessToken = response.accessToken;
      tokenObject.expirationTime = response.expirationTime;
      localStorage.setItem('token', JSON.stringify(tokenObject));
      this.scheduleTokenRefresh(response.expirationTime); // Ejecuta la función del refresh token para iniciar un nuevo ciclo
    }  catch (error) {
      this.modalService.openMenssageTypes({
        text: "Error al refresh token.",
        subtitle: (error as any).response.data.message,
        url: null,
        type: "error"
      })
      throw new HttpErrorResponse({ error });
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  private scheduleTokenRefresh(expirationTime: string): void {
    const currentTime = moment();
    const expirationMoment = moment(expirationTime);
    const timeToExpire = expirationMoment.diff(currentTime);
    if (timeToExpire > 0) {
      const refreshTime = timeToExpire * 0.5; // Se cambia a 0.5 para refrescar a mitad del tiempo
      timer(refreshTime).subscribe(async () => {
        await this.refreshToken();
      });
    } else {
      console.error('Expiration time is in the past');
    }
  }

  public initializeTokenRefresh(): void { 
    const tokenString = localStorage.getItem('token'); // Obtiene el token del local storage
    if (tokenString) {
      const tokenObject = JSON.parse(tokenString) as TokenI; // Lo transforma a objeto
      const expirationTime = tokenObject.expirationTime; // Consigue el tiempo de expiración
      if (expirationTime) {
        this.scheduleTokenRefresh(expirationTime); // Ejecuta la función del ciclo de refreshToken
      }
    }
  }

  async isTokenValid(): Promise<boolean> {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      return false;
    }
    const tokenObject = JSON.parse(tokenString) as TokenI;
    try {
      const response = await axios.post(`${backendUsersUrl}/authorization`, {
        token: tokenObject.accessToken,
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
}
