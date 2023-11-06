import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from './product/model/product.model';
import { ProductEditModel } from './product/model/product-edit.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productData: ProductEditModel | undefined

  constructor(private http: HttpClient) { }

  url: string = 'http://localhost:3000'

  public get(page: number, limit: number, sort: string): Observable<any> {
    return this.http.get(`${this.url}/v1/product?page=${page}&limit=${limit}&sort=${sort}`);
  }

  public getStore(): Observable<any> {
    return this.http.get(`${this.url}/v1/store`);
  }

  public create(payload: ProductModel): Observable<any> {
    return this.http.post<ProductModel>(`${this.url}/v1/product`, payload)
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/v1/product/${id}`)
  }

  public getStoresImage(id: number): Observable<any> {
    return this.http.get(`${this.url}/v1/product-store/list-store-image/${id}`)
  }

  public setProductData(productData: ProductEditModel): void {
    this.productData = productData;
  }

  public update(productData: ProductModel): Observable<any> {
    return this.http.put<ProductModel>(`${this.url}/v1/product/${productData.id}`, productData)
  }

  public getProductData(): ProductEditModel | undefined {
    return this.productData
  }

  public clearProductData(): void {
    this.productData = undefined;
  }
}
