import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CustomerService } from '../../../core/services/customer.service';
import { Router } from '@angular/router';
import { ModalService } from '../modal.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form-reservation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-reservation.component.html',
  styleUrl: './form-reservation.component.css'
})
export class FormReservationComponent{


}
