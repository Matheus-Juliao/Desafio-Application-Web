import { Component } from '@angular/core';
import { ProductService } from '../../product.service';
import { Modal } from 'bootstrap';
import { StoreModel } from 'src/app/model/store.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateProductModel } from 'src/app/model/create-product.model';

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
  formStorePrice: FormGroup

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.formStorePrice = this.createFormStorePriceBuilder()
    this.form = this.createForm()
  }

  ngOnInit() {
    const element = document.getElementById('modal') as HTMLElement;
    this.modal = new Modal(element)
    this.loadStore()
  }

  openModal() {
    this.modal.show()
  }

  closeModal() {
    this.formStorePrice.reset()
    this.modal.hide()
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
        this.formStorePrice.reset()
        this.modal.hide()
      } else {
        this.toastr.error("Não é permitido mais que um preço de venda para a mesma loja.")
      }
    } else {
      this.toastr.error("Um ou mais campos obrigatórios não foram preenchidos corretamente.")
    }
  }

  create(form: FormGroup): void {
    if(this.storePriceSale.length == 0) {
      this.toastr.error("O cadastro deve conter ao menos uma loja para que seja permitido salvar")
    }

    if(form.valid) {
      let payload = this.formatPayload(form)
      // this.save(payload)

      console.log(payload)
    }
    else {
      this.toastr.error("Um ou mais campos obrigatórios não foram preenchidos corretamente.")
    }
  }

  private createFormStorePriceBuilder(): FormGroup {
    return this.formBuilder.group({
      selectedStore: ['', Validators.required],
      priceSale: ['', [Validators.required, this.priceValidator]]
    });
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      description: ['', Validators.required],
      cost: ['', [ this.priceValidator]],
      image: [''],
      stores: ['']
    });
  }

  private loadStore(): void {
    this.productService.getStore().subscribe({
      next: (res) => {
        this.stores = res as StoreModel[]
      }
    })
  }

  private priceValidator(control: FormControl): Object | null {
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

  private formatPayload(form: FormGroup) {
    let store = this.storePriceSale.map(sps => ({
      id: sps.id,
      priceSale: sps.priceSale.replace(',', '.')
    }))

    form.patchValue({ stores: store, cost: form.value.cost.replace(',', '.') })
    form.value.image = form.value.image == "" ? null : form.value.image

    return form.value as CreateProductModel
  }

  private save(payload: CreateProductModel): void {
    this.productService.create(payload).subscribe({
      next: (_res) => {
        this.toastr.success("Produto salvo com sucesso")
      },
      error: (err) => {
        console.log(err)
        this.toastr.error("Erro ao salvar produto")
      }
    })
  }
}
