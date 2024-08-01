import { Injectable } from '@angular/core';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';
import { backendUrl } from './api-environments';
import { ModalService } from '../../components/modals/modal.service';
import { ICustomer } from '../../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class GestorCancelarTurnoService {

  constructor(private modalService: ModalService) { }



  async cancelReservation(id: number, customer: ICustomer): Promise<any> {
    try{
        const response = await axios.post(`${backendUrl}/gestor-cancelar-turno/`, {reservation: id, customer: customer});
        console.log(response.data);
        return response.data;
    }catch(error){
        let subtitle = null;
        if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
            subtitle = (error as any).response.data.message;
        }
        this.modalService.openMenssageTypes({
            text:"Error al cancelar la reserva",
            subtitle: subtitle,
            url:null,
            type:"error"
        })
        throw new HttpErrorResponse({ error });
    }
}

}