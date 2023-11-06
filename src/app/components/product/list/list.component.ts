import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductResponse } from 'src/app/components/product/model/product-response.model';
import { ProductListModel } from 'src/app/components/product/model/product-list.model';
import { StoresImagesModel } from 'src/app/components/product/model/stores-image.model';
import { ProductService } from '../../product.service';
import { ProductEditModel } from '../model/product-edit.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  products: ProductListModel[] = []
  storesImage: StoresImagesModel | undefined
  popUp: any;
  selectedProductId: number | undefined
  @Output() productData = new EventEmitter()

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const element = document.getElementById('pop-up-confirmation') as HTMLElement;
    this.popUp = new Modal(element)
    this.listProducts()
  }

  registerProduct(): void {
    this.router.navigate(['/cadastro']);
  }

  openPopUp(id: number): void {
    this.selectedProductId = id
    this.popUp.show()
  }

  delete(): void {
    this.productService.delete(this.selectedProductId as number).subscribe({
      next: (_res) => {
        this.removeProduct(this.selectedProductId as number)
        this.selectedProductId = undefined
        this.popUp.hide()
        this.toastr.success("Produto excluído com sucesso.")
      },
      error: (err) => {
        console.log(err)
        this.toastr.error("Erro ao excluir produto.")
      }
    })
  }

  edit(product: any): void {
    this.productService.getStoresImage(product.id).subscribe({
      next: (res) => {
        this.storesImage = res as StoresImagesModel
      },
      complete: () => {
        let data = { 
          id: product.id,
          description: product.description,
          cost: product.cost,
          // image: this.storesImage?.image[0].image.data,
          stores: this.storesImage?.stores
        } as ProductEditModel
        this.productService.setProductData(data)
        this.router.navigate(['editar', product.id]);
      },
      error: (err) => {
        this.toastr.error("Erro ao carregar lojas e imagem.")
        console.log(err)
      }
    })
  }

  private removeProduct(id: number): void {
    this.products = this.products.filter(product => product.id !== id);
  }

  private listProducts(): void {
    this.productService.get(1, 10, 'id:asc').subscribe({
      next: (res) => {
        let response = res as ProductResponse
        response.data.map(product => {
          product.cost = product.cost? parseFloat(product.cost).toLocaleString('pt-br', {minimumFractionDigits: 3}) : ""
        })
        this.products = response.data
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}