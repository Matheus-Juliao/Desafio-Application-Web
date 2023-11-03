import { Component } from '@angular/core';
import { ProductService } from '../../product.service';
import { Modal } from 'bootstrap';
import { StoreModel } from 'src/app/model/store.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  modal: any;
  stores: StoreModel[] = [];
  storePriceSale: any[] = []
  form: FormGroup

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.createFormBuilder()
  }

  ngOnInit() {
    const element = document.getElementById('modal') as HTMLElement;
    this.modal = new Modal(element)
    this.loadStore()
  }

  openModal() {
    this.modal.show()
  }

  addStorePriceSale(form: FormGroup): void {
    console.log(form)
    if(form.valid) {
      if(!this.checkIfStoreExists(form)) {
        const formStorePriceSale = {
          id: form.value.selectedStore.id,
          description: form.value.selectedStore.description,
          priceSale: form.value.priceSale
        }
  
        this.storePriceSale.push(formStorePriceSale)
        console.log(this.storePriceSale)
        this.form.reset()
        this.modal.hide()
      } else {
        this.toastr.error("Não é permitido mais que um preço de venda para a mesma loja.")
      }
    } else {
      this.toastr.error("Um ou mais campos obrigatórios não foram preenchidos corretamente.")
    }
  }

  private createFormBuilder(): FormGroup {
    return this.formBuilder.group({
      selectedStore: ['', Validators.required],
      priceSale: ['', [Validators.required, this.priceSaleValidator]]
    });
  }

  private loadStore(): void {
    this.productService.getStore().subscribe({
      next: (res) => {
        this.stores = res as StoreModel[]
      }
    })
  }

  private priceSaleValidator(control: FormControl): Object | null {
    const inputValue = control.value;
    const valid = /^\d{1,13}(\,\d{1,3})?$/.test(inputValue)
  
    return valid ? null : { invalidPriceSale: true }
  }

  private checkIfStoreExists(form: FormGroup): boolean {
    const isDuplicate = this.storePriceSale.some(store => 
      store.id === form.value.selectedStore.id
    );

    return isDuplicate;
  }
}
