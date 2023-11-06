import { StoreModel } from "./store.model";

export interface ProductModel {
    id: number
    description: string,
    cost: number,
    image: string,
    stores: StoreModel[]
}