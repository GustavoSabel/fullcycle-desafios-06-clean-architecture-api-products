import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

describe("Test list product use case", () => {
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

   it("should list the products", async () => {
      const productRepository = new ProductRepository();
  
      const product1 = new Product("1", "Product 1", 1000);
      await productRepository.create(product1);
      const product2 = new Product("2", "Product 2", 2000);
      await productRepository.create(product2);

      const useCase = new ListProductUseCase(productRepository);

      const result = await useCase.execute({});

      expect(result.products.length).toBe(2);
      expect(result.products[0].id).toBe(product1.id);
      expect(result.products[0].name).toBe(product1.name);
      expect(result.products[0].price).toBe(product1.price);
      expect(result.products[1].id).toBe(product2.id);
   });
});
