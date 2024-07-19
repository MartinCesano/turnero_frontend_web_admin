import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-products-abm',
  standalone: true,
  imports: [CommonModule], // Agrega CommonModule aquí
  templateUrl: './products-abm.component.html',
  styleUrls: ['./products-abm.component.css']
})
export class ProductsABMComponent {
  products: any[] = [];
  selectedProduct: any = null;
  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    await this.getProducts();
    
  }

  async getProducts() {
    try {
      this.products = await this.api.getProducts();
    } catch (error) {
      alert('Error al obtener los productos');
    }
  }
  async updateProductById(product?: any) {
    console.log("holaaa");
    if (product) {
      this.router.navigate(['/form-products'], { queryParams: { id: product.id } });
    }else{
      this.router.navigate(['/form-products']);
    }
  }
  
  async deleteProductById(id: number) {
    try {
      await this.api.deleteProductById(id);
      await this.getProducts();
    } catch (error) {
      alert('Error al eliminar el producto');
    }    
  }

  

}
