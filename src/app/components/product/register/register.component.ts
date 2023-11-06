import { Component, OnDestroy } from '@angular/core';
import { ProductService } from '../../product.service';
import { Modal } from 'bootstrap';
import { StoreModel } from 'src/app/components/product/model/store.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductModel } from 'src/app/components/product/model/product.model';
import { ProductEditModel } from '../model/product-edit.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  modal: any;
  stores: StoreModel[] = [];
  storePriceSale: any[] = []
  form: FormGroup
  formStorePrice: FormGroup
  selectedImage: string | ArrayBuffer | null = null
  editStorePriceSale: boolean = false
  productData: ProductEditModel | undefined
  selectedProductId: number | undefined

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.formStorePrice = this.createFormStorePriceBuilder()
    this.form = this.createForm()
  }

  ngOnInit(): void {
    this.createModal()
    this.loadStore()
    this.productData = this.productService.getProductData()

    this.productData?.stores.map(store => {
      store.priceSale = store.priceSale ? store.priceSale.replace(".", ",") : store.priceSale
    })

    if(this.productData) {
      this.form.patchValue({
        id: this.productData.id,
        description: this.productData.description,
        cost: this.productData.cost,
        // image: this.bufferToBase64(this.productData.image),
      })
      this.storePriceSale = this.productData.stores
      this.selectedProductId = this.productData.id
    }
  }

  ngOnDestroy(): void {
    this.productService.clearProductData();
  }

  openModal(): void {
    this.modal.show()
  }

  closeModal(): void {
    this.formStorePrice.reset()
    this.modal.hide()
  }

  addStorePriceSale(formStorePrice: FormGroup, editStorePriceSale: boolean): void {
    if(formStorePrice.valid) {
      if(!this.checkIfStoreExists(formStorePrice) || editStorePriceSale) {
        let selectedStore = this.getStore(formStorePrice)
        if(selectedStore != undefined) {
          const formStorePriceSale = {
            id: selectedStore.id,
            description: selectedStore.description,
            priceSale: parseFloat( formStorePrice.value.priceSale.replace(",", ".")).toFixed(3).toString().replace(".", ",")
          }
          if(editStorePriceSale) {
            this.removePriceSale(selectedStore.id)
            this.storePriceSale.push(formStorePriceSale)
            this.editStorePriceSale = false
          } else {
            this.storePriceSale.push(formStorePriceSale)
          }
          this.formStorePrice.reset()
          this.modal.hide()
        }
      } else {
        this.toastr.error("Não é permitido mais que um preço de venda para a mesma loja.")
      }
    } else {
      this.toastr.error("Um ou mais campos obrigatórios não foram preenchidos corretamente.")
    }
  }

  create(form: FormGroup): void {
    if(this.storePriceSale.length != 0) {
      if(form.valid) {
        let payload = this.formatPayload(form)
        payload.image = this.selectedImage as string
        if(this.productData) {
          this.edit(payload)
        } else {
          this.save(payload)
        }
      }
      else {
        this.toastr.error("Um ou mais campos obrigatórios não foram preenchidos corretamente.")
      }
    } else {
      this.toastr.error("O cadastro deve conter ao menos uma loja para que seja permitido salvar")
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0] as File;

    if(file) {
      const allowedExtensions = ['.png', '.jpg', '.jpeg'];
      const fileExtension = file.name.toLowerCase().slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImage = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.removeImage()
        this.toastr.error("Por favor, selecione um arquivo de imagem PNG ou JPG.")
      }
    }
  }

  removeImage(): void {
    this.selectedImage = null
    const fileInput = document.getElementById('customFile') as HTMLInputElement
    fileInput.value = ''
  }

  removePriceSale(idStore: any): void {
    this.storePriceSale = this.storePriceSale.filter(item => item.id !== idStore);
  }

  setData(event: any): void {
    console.log(event)
  }

  editPriceSale(storePriceSale: any): void {
    this.editStorePriceSale = true
    this.formStorePrice.patchValue({ 
      selectedStore: storePriceSale.id,
      priceSale: storePriceSale.priceSale
    })
    
    this.openModal()
  }

  delete(): void {
    if(!this.selectedProductId) {
      this.toastr.error("Nenhum produto selecionado")
    } else {
      this.productService.delete(this.selectedProductId as number).subscribe({
        next: (_res) => {
          this.selectedProductId = undefined
          this.toastr.success("Produto excluido com sucesso.")
          this.router.navigate(['/cadastro'])
        },
        error: (err) => {
          console.log(err)
          this.toastr.error("Erro ao excluir produto.")
        }
      })
    }
  }

  private bufferToBase64(buffer: ArrayBuffer): string {
    const binaryArray = new Uint8Array(buffer);
    const binaryString = String.fromCharCode(...binaryArray);
    return btoa(binaryString);
  }

  private createFormStorePriceBuilder(): FormGroup {
    return this.formBuilder.group({
      selectedStore: ['', Validators.required],
      priceSale: ['', [Validators.required, this.priceSaleValidator]]
    });
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      description: ['', Validators.required],
      cost: [null, [ this.priceCoastValidator]],
      image: [null],
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

  private priceSaleValidator(control: FormControl): Object | null {
    const inputValue = control.value;
    const valid = /^\d{1,13}(\,\d{1,3})?$/.test(inputValue)
  
    return valid ? null : { invalidPriceSale: true }
  }

  private priceCoastValidator(control: FormControl): Object | null {
    const inputValue = control.value;
    if (inputValue === null || inputValue === '') {
      return null;
    }
    const valid = /^\d{1,13}(\,\d{1,3})?$/.test(inputValue)
  
    return valid ? null : { invalidPriceSale: true }
  }

  private checkIfStoreExists(form: FormGroup): boolean {
    return this.storePriceSale.some(store => 
      store.id == form.value.selectedStore
    );
  }

  private getStore(form: FormGroup): StoreModel | undefined {
    return this.stores.find(store => store.id == form.value.selectedStore)
  }

  private formatPayload(form: FormGroup): ProductModel {
    let store = this.storePriceSale.map(sps => ({
      id: sps.id,
      priceSale: sps.priceSale.replace(',', '.')
    }))
    form.patchValue({ 
      stores: store, 
      cost: form.value.cost ? form.value.cost.replace(',', '.') : form.value.cost
    })

    return form.value as ProductModel
  }

  private save(payload: ProductModel): void {
    this.productService.create(payload).subscribe({
      next: (_res) => {
        this.toastr.success("Produto salvo com sucesso")
        this.form.reset()
        this.formStorePrice.reset()
        this.removeImage()
        this.storePriceSale = []
      },
      error: (err) => {
        console.log(err)
        this.toastr.error("Erro ao salvar produto")
      }
    })
  }

  private edit(payload: ProductModel): void {
    this.productService.update(payload).subscribe({
      next: (_res) => {
        this.toastr.success("Produto editado com sucesso")
      },
      error: (err) => {
        console.log(err)
        this.toastr.error("Erro ao salvar produto")
      }
    })
  }

  private createModal(): void {
    const element = document.getElementById('modal') as HTMLElement;
    this.modal = new Modal(element)
  }
}