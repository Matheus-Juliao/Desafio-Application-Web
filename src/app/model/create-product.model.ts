import { StoreModel } from "./store.model";

export interface CreateProductModel {
    description: string,
    cost: number,
    image: string,
    stores: StoreModel[]
}