import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { RegisterComponent } from './components/product/register/register.component';

const routes: Routes = [
  { path: '', component: ProductComponent },
  { path: 'cadastro', component: RegisterComponent },
  { path: '', redirectTo: '/produto', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
