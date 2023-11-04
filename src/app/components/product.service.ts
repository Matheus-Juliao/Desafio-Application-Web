import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProductModel } from '../model/create-product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  url: string = 'http://localhost:3000'

  public get(page: number, limit: number, sort: string): Observable<any> {
    return this.http.get(`${this.url}/v1/product?page=${page}&limit=${limit}&sort=${sort}`);
  }

  public getStore(): Observable<any> {
    return this.http.get(`${this.url}/v1/store`);
  }

  public create(payload: CreateProductModel): Observable<any> {
    return this.http.post<CreateProductModel>(`${this.url}/v1/product`, payload)
  }
}
