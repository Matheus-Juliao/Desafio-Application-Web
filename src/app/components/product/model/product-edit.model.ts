import { StoreEditModel } from "./store-edit.model";

export interface ProductEditModel {
    id: number
    description: string,
    cost: number,
    image: any,
    stores: StoreEditModel[]
}