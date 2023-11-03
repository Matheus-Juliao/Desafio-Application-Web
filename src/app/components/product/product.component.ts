import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductResponse } from 'src/app/model/product-response.model';
import { ProductModel } from 'src/app/model/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  public products: ProductModel[] = []

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.productService.get(1, 10, 'id:asc').subscribe({
      next: (res) => {
        console.log(res)
        let response = res as ProductResponse
        response.data.map(product => {
          product.cost = parseFloat(product.cost).toLocaleString('pt-br', {minimumFractionDigits: 2})
        })
        this.products = response.data
      },
      error: (err) => {
        console.log(err)
      }
    }))
  }

  public registerProduct(): void {
    this.router.navigate(['/cadastro']);
  }
}
