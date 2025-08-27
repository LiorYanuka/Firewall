import request from "supertest";
import app from "../src/server";

describe("System happy flow", () => {
    test("add -> retrieve -> toggle -> retrieve", async () => {
        await request(app).post("/api/firewall/ip/add").send({ values: ["10.0.0.1"], mode: "whitelist" }).expect(200);

        const r1 = await request(app).get("/api/firewall/rules/retrieve").expect(200);
        expect(r1.body).toHaveProperty("ip");

        await request(app)
            .patch("/api/firewall/rules/toggle")
            .send({ ips: { values: ["10.0.0.1"], active: false } })
            .expect(201);

        const r2 = await request(app).get("/api/firewall/rules/retrieve").expect(200);
        expect(r2.body).toHaveProperty("ip");
    });
});


