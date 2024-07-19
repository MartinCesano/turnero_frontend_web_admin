import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-products.component.html',
  styleUrls: ['./form-products.component.css']
})
export class FormProductsComponent implements OnInit {

  url = 'http://localhost:3001';
  id: string = '';

  product = {
    'name': null,
    'price': null,
    'size': null,
    'color': null,
    'productType': null
  };

  productTypes: any[] = [];
  
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }

  async ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];

    try {
      this.productTypes = await this.api.getProductTypes();
    } catch (error) {
      console.error('Error al obtener los tipos de productos', error);
    }

    if (this.id) {
      const productById = await this.api.getProductById(parseInt(this.id));
      this.product.name = productById.name;
      this.product.price = productById.price;
      this.product.size = productById.size;
      this.product.color = productById.color;
      this.product.productType = productById.productType.id;
      console.log('productById', productById);
    } else {
      this.id = '';
    }
  }

  async saveProduct() {
    if (this.product.name && this.product.price && this.product.size && this.product.color && this.product.productType){
      if (this.id) {
        console.log('update', this.product, this.product.productType);
        await this.api.updateProductById(parseInt(this.id), this.product);
        this.router.navigate(['/list-products']);
      } else {
        try {
          await this.api.createProduct(this.product);
          this.router.navigate(['/list-products']);
        } catch (error) {
          alert('Error al crear el producto');
        }
      }
      alert('El producto se ha guardado correctamente');
    }else{
      alert('Por favor complete todos los campos');
  }
}

  cancelarProduct() {
    this.router.navigate(['/list-products']);
  }
}
