import { ProductModel } from "./product.model";

export interface ProductResponse {
    data: ProductModel[],
    limit: string,
    page: string,
    total: number
}