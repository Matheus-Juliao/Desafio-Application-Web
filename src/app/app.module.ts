import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProductModule } from './components/product.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ProductComponent } from './components/product/product.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }