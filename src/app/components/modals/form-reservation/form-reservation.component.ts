import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CustomerService } from '../../../core/services/customer.service';
import { Router } from '@angular/router';
import { ModalService } from '../modal.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { IReservation } from '../../../interfaces/reservation.interface';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../../core/services/state.service'; 
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-form-reservation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './form-reservation.component.html',
  styleUrls: ['./form-reservation.component.css'] // Corregido styleUrl a styleUrls
})
export class FormReservationComponent implements OnInit {

  reservation: IReservation | null = null; 
  form: FormGroup;
  btnPresent: boolean = false;
  btnAbsent : boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {reservation:IReservation, date:string},
    private dialogRef: MatDialogRef<FormReservationComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private modalService: ModalService,
    private stateService: StateService,
    private reservationService: ReservationService
  ) {
    // Inicialización del formulario con valores por defecto
    this.form = this.fb.group({
      customer: [{ value: '', disabled: true }],
      document: [{ value: '', disabled: true }],
      date: [{ value: '', disabled: true }],
      time: [{ value: '', disabled: true }],
      state:[{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.reservation = this.data.reservation;
    this.inicializeForm();
  }


  inicializeForm(){
    this.btnAbsent = false;
    this.btnPresent = false;
    if (this.reservation) {
      this.form.patchValue({
        customer: `${this.reservation.customer.name} ${this.reservation.customer.lastname}`,
        document: this.reservation.customer.document,
        date: this.data.date,
        time: this.reservation.appointment?.appointmentTimes?.startTime,
        state: this.reservation.state.name
      });
      if(this.reservation.state.name === 'present'){
        this.btnAbsent = true;
      }else if(this.reservation.state.name === 'absent'){
        this.btnPresent = true;
      }
    }
  }

  async changeState(){
    this.modalService.loading("Cambiando estado de la reserva");
    try{
      if(this.btnAbsent){
        const stateAbsten = await this.stateService.getStateByName('absent');
        if (this.reservation) {
          this.reservation = await this.reservationService.changeState(this.reservation.id, stateAbsten);
          console.log(this.reservation);
        }
      }
      if(this.btnPresent){
        const statePresent = await this.stateService.getStateByName('present');
        if (this.reservation) {
          this.reservation = await this.reservationService.changeState(this.reservation.id, statePresent); 
          console.log(this.reservation);

        }
      }
      this.inicializeForm();
    } catch (error) {
      console.error(error);
    }
    this.modalService.loadingClose();
  }
  
  saveReservation(){
    this.dialogRef.close()
  }

}
