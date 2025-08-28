import request from "supertest";
import app from "../src/server";

describe("Universal endpoints", () => {
  test("add ip whitelist", async () => {
    const res = await request(app)
      .post("/api/firewall/ip")
      .send({
        values: ["127.0.0.1", "::1"],
        mode: "whitelist",
      });
    expect(res.status).toBe(200);
  });

  test("add url blacklist", async () => {
    const res = await request(app)
      .post("/api/firewall/url")
      .send({
        values: ["https://example.com", "http://localhost:3000"],
        mode: "blacklist",
      });
    expect(res.status).toBe(200);
  });

  test("add port whitelist", async () => {
    const res = await request(app)
      .post("/api/firewall/port")
      .send({
        values: [80, 443, 65535],
        mode: "whitelist",
      });
    expect(res.status).toBe(200);
  });

  test("duplicate add ignored", async () => {
    const res = await request(app)
      .post("/api/firewall/ip")
      .send({
        values: ["127.0.0.1"],
        mode: "whitelist",
      });
    expect(res.status).toBe(200);
  });

  test("invalid ip payload returns error", async () => {
    const res = await request(app)
      .post("/api/firewall/ip")
      .send({
        values: [123],
        mode: "whitelist",
      });
    expect([400, 500]).toContain(res.status);
  });
});
