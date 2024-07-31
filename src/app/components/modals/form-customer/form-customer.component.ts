import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CustomerService } from '../../../core/services/customer.service';
import { Router } from '@angular/router';
import { ModalService } from '../modal.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form-customer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-customer.component.html',
  styleUrls: ['./form-customer.component.css']
})
export class FormCustomerComponent implements OnInit {
  customerForm: FormGroup;
  isHelpVisible: boolean = false;
  helpMessage = "";

  datosRegistro = {
    type: "successful",
    text: "El cliente se registró correctamente",
    url: null,
    subtitle: ""
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormCustomerComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private modalService: ModalService
  ) {
    this.customerForm = this.fb.group({
      document: ['', [Validators.required, Validators.min(10000000), Validators.max(99999999)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      phoneAreaCode: ['', [Validators.required, Validators.min(10), Validators.max(9999)]],
      phoneNumber: ['', [Validators.required, Validators.min(100000), Validators.max(99999999)]],
      birthdate: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      //hace disable el input del document
      this.customerForm?.get('document')?.disable();

      this.customerForm.patchValue({
        document: this.data.document,
        name: this.data.name,
        lastname: this.data.lastname,
        phoneAreaCode: this.getPhoneAreaCode(this.data.phone.toString()),
        phoneNumber: this.getPhoneNumber(this.data.phone.toString()),
        birthdate: this.data.birthdate
      });
    }
  }

  async registerCustomer(): Promise<void> {
    if (this.customerForm.valid) {
        try {
          const customer = {
            ...this.customerForm.value,
            phone: `549${this.customerForm.value.phoneAreaCode}${this.customerForm.value.phoneNumber}`
          };
          delete customer.phoneCountryCode;
          delete customer.phoneAreaCode;
          delete customer.phoneNumber;
          if (this.data) {
            await this.customerService.updateCustomer(this.data.document, customer);
          }else{
            await this.customerService.createCustomer(customer);
          }
          sessionStorage.setItem("customer", JSON.stringify(customer));
          this.modalService.openMenssageTypes(this.datosRegistro);
          this.dialogRef.close(); // Cierra el modal
          window.location.reload(); // Recarga la página
        } catch (error) {
          console.error(error);
        }
    }
    else {
      console.error('Formulario inválido');
    }
  }

  showHelpMessage(text: string) {
    this.isHelpVisible = true;
    this.helpMessage = text;
  }

  hideHelpMessage() {
    this.isHelpVisible = false;
  }

  private getPhoneAreaCode(phone: string): string {
    // Extrae el código de área de la cadena de teléfono
    return phone.substring(3, 6); // Posiciones 4, 5 y 6
  }

  private getPhoneNumber(phone: string): string {
    // Extrae el número de teléfono de la cadena de teléfono
    return phone.substring(6); // Desde la posición 7 hasta el final
  }

  cancel() {
    this.dialogRef.close();
  }

}
