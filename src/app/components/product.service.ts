import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  url: string = 'http://localhost:3000'

  public get(page: number, limit: number, sort: string) {
    return this.http.get(`${this.url}/v1/product?page=${page}&limit=${limit}&sort=${sort}`);
  }

  public getStore() {
    return this.http.get(`${this.url}/v1/store`);
  }
}
