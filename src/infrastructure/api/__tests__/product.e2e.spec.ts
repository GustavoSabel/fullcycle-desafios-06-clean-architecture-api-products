import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Watermelon",
      price: "10",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Watermelon");
    expect(response.body.price).toBe("10");
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Watermelon",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const response = await request(app).post("/product").send({
      name: "Pinapple",
      price: "20",
    });
    expect(response.status).toBe(200);
    const response2 = await request(app).post("/product").send({
      name: "Apple",
      price: "30",
    });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
  
    const product1 = listResponse.body.products[0];
    expect(product1.name).toBe("Pinapple");
    expect(product1.price).toBe(20);
  
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Apple");
    expect(product2.price).toBe(30);

    const listResponseXML = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(
      `<?xml version="1.0" encoding="UTF-8"?>`
    );
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Pinapple</name>`);
    expect(listResponseXML.text).toContain(`<price>20</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<name>Apple</name>`);
    expect(listResponseXML.text).toContain(`<price>30</price>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });
});
