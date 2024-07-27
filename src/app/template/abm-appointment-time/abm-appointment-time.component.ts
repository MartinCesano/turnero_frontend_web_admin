import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentTimeService } from '../../core/services/appointment-time.service';

//importaciones del modal

import { ModalService } from '../../components/modals/modal.service';


@Component({
  selector: 'abm-appointment-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-appointment-time.component.html',
  styleUrl: './abm-appointment-time.component.css'
})

export class AbmAppointmentTimeComponent{
  appointmentTimes: any[] = [];
  selectedAppointment: any;

  constructor(private appointmentTimeService: AppointmentTimeService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.getAppointmentTimes();
  }

  async getAppointmentTimes() {
    try {
      this.appointmentTimes = await this.appointmentTimeService.getAppointmentTimes();
    } catch (error) {
      console.error('Error fetching appointment times:', error);
    }
  }

  async createAppointmentTime() {
    try {
      const startTimeInput = document.getElementById('startTime') as HTMLInputElement;
      const endTimeInput = document.getElementById('endTime') as HTMLInputElement;

      const newAppointmentTime = {
        startTime: startTimeInput.value.toString(),
        endTime: endTimeInput.value.toString()
      };

      const response = await this.appointmentTimeService.createAppointmentTime(newAppointmentTime);
      this.getAppointmentTimes();
      

    } catch (error) {
      console.error('Error creating appointment time:', error);
    }
  }

  editAppointmentTime(appointment: any) {
    this.selectedAppointment = { ...appointment };
  }

  confirmDelete(appointment: any) {
    this.selectedAppointment = appointment;
  }

  async deleteAppointmentTime() {
    try {
      if (this.selectedAppointment) {
        await this.appointmentTimeService.deleteAppointmentTime(this.selectedAppointment.id);
        this.appointmentTimes = this.appointmentTimes.filter(app => app.id !== this.selectedAppointment.id);
        this.selectedAppointment = null;
      }
    } catch (error) {
      console.error('Error deleting appointment time:' , error);
    }
  }

  async updateAppointmentTime() {
    try {
      if (this.selectedAppointment) {
        await this.appointmentTimeService.updateAppointmentTime(this.selectedAppointment);
        this.appointmentTimes = this.appointmentTimes.map(app => 
          app.id === this.selectedAppointment.id ? this.selectedAppointment : app
        );
        this.selectedAppointment = null;
      }
    } catch (error) {
      console.error('Error updating appointment time:', error);
    }
  }
}
