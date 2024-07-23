import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-message-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-types.component.html',
  styleUrls: ['./message-types.component.css']
})
export class MessageTypesComponent {
  type = 'success';
  text = "Los datos se registraron correctamente";
  subtitle = null
  icon = "bi bi-check2-circle text-success";
  buttonColor = "btn-success"

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MessageTypesComponent>, // Inyecta MatDialogRef aquí
    public dialog: MatDialog
  ) { 
    this.type = data.type;
    this.text = data.text;
    this.subtitle = data.subtitle
    if(this.type=="success"){
      this.icon = "bi bi-check2-circle text-success";
      this.buttonColor =  "btn-success"
    }
    else if(this.type=="error"){
      this.icon = "bi bi-x-circle text-danger";
      this.buttonColor =  "btn-danger"
    }
    else if(this.type=="alert"){
      this.icon = "bi bi-exclamation-circle text-primary";
      this.buttonColor =  "btn-primary"
    }
  }
  
  close() {
    this.dialogRef.close(); // Cierra el modal
  }
}