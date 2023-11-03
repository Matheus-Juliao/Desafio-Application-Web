import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from '../../product.service';
import { StoreModel } from 'src/app/model/store.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  stores: StoreModel[] = [];
  storePriceSale: any[] = []
  form: FormGroup
  @ViewChild('modal') modal!: ElementRef;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
     this.form = this.createFormBuilder()
  } 

  ngOnInit(): void {
    this.loadStore()
  }

  save(form: FormGroup): void {
    console.log(form.value)
    this.closeModal()
  }

  closeModal(): void {
    const modalElement: any = this.modal.nativeElement;
    if (modalElement) {
      modalElement.hide();
    } else {
      console.error("Element with ID 'modal' not found");
    }
  }

  private createFormBuilder(): FormGroup {
    return this.formBuilder.group({
      selectedStore: ['', Validators.required],
      priceSale: ['', Validators.required]
    });
  }

  private loadStore(): void {
    this.productService.getStore().subscribe({
      next: (res) => {
        this.stores = res as StoreModel[]
      }
    })
  }

}
