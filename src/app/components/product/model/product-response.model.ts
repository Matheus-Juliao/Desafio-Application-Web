import { ProductListModel } from "./product-list.model";

export interface ProductResponse {
    data: ProductListModel[],
    limit: string,
    page: string,
    total: number
}