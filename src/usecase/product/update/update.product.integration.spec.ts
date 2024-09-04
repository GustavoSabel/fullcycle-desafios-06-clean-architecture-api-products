import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 1000);
    await productRepository.create(product)

    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: product.id,
      name: "Product 1 Updated",
      price: 2000,
    };

    const response = await usecase.execute(input);

    expect(response).toEqual({
      id: expect.any(String),
      ...input,
    });

    const updatedProduct = await productRepository.find(response.id);
    expect(updatedProduct.name).toEqual(input.name);
    expect(updatedProduct.price).toEqual(input.price);
  });
});
