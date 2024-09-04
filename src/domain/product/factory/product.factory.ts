import Product from "../entity/product";
import ProductInterface from "../entity/product.interface";
import { v4 as uuid } from "uuid";
import ProductB from "../entity/product-b";

export default class ProductFactory {
  public static create(
    type: string,
    name: string,
    price: number
  ): ProductInterface {
    switch (type) {
      case "a":
        return this.createA(name, price);
      case "b":
        return this.createB(name, price);
      default:
        throw new Error("Product type not supported");
    }
  }

  public static createA(name: string, price: number): Product {
    return new Product(uuid(), name, price);
  }

  public static createB(name: string, price: number): ProductB {
    return new ProductB(uuid(), name, price);
  }
}
