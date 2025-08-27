import request from "supertest";
import app from "../src/server";

describe("Rules retrieve and toggle", () => {
    test("retrieve rules", async () => {
        const res = await request(app).get("/api/firewall/rules/retrieve");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("ip");
        expect(res.body).toHaveProperty("url");
        expect(res.body).toHaveProperty("port");
    });

    test("toggle multiple types", async () => {
        const res = await request(app).patch("/api/firewall/rules/toggle").send({
            ips: { values: ["127.0.0.1"], active: false },
            urls: { values: ["https://example.com"], active: true },
            ports: { values: [80], active: false }
        });
        expect(res.status).toBe(201);
        expect(Array.isArray(res.body.updated)).toBe(true);
    });
});


