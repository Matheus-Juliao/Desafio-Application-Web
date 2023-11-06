import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './product/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './product/list/list.component';

@NgModule({
  declarations: [
    RegisterComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  exports: [ListComponent, RegisterComponent]
})
export class ProductModule { }