import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './product/register/register.component';
import { ModalComponent } from './product/modal/modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RegisterComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
