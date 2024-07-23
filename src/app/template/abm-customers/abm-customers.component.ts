import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../core/services/customer.service';
import { ModalService } from '../../components/modals/modal.service';

@Component({
  selector: 'app-abm-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-customers.component.html',
  styleUrl: './abm-customers.component.css'
})
export class AbmCustomersComponent {

  customers: any[] = [];

  selectedCustomer: any;

  constructor(private customerService:CustomerService, private modalService:ModalService) { }

  async ngOnInit(): Promise<void> {
    this.modalService.loading("cargando clientes")
    try{
      this.customers = await this.customerService.getCustomers();
    } catch (error){
      console.error(error);
    }
    this.modalService.loadingClose();
  }


  editCustomer(customer: any){
  
  }


  confirmDelete(customer:any){

  }


  createCustomer(){

  }

  deleteCustomer(){

  }

}
