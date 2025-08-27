import { validateRules } from "../src/middleware/validationMiddleware";

describe("validateRules", () => {
    test("valid ports", () => {
        expect(validateRules({ values: [80, 443], mode: "whitelist" }, "port")).toEqual([80, 443]);
    });

    test("valid ip strings", () => {
        expect(validateRules({ values: ["127.0.0.1", "::1"], mode: "blacklist" }, "ip")).toEqual(["127.0.0.1", "::1"]);
    });

    test("valid urls normalized", () => {
        expect(validateRules({ values: [" HTTPS://EXAMPLE.com "], mode: "whitelist" }, "url")).toEqual(["https://example.com"]);
    });

    test("empty values throws", () => {
        expect(() => validateRules({ values: [], mode: "whitelist" }, "ip")).toThrow();
    });

    test("invalid mode throws", () => {
        expect(() => validateRules({ values: ["a"], mode: "foo" as any }, "url")).toThrow();
    });

    test("rejects non-array values", () => {
        expect(() => validateRules({ values: "not-array", mode: "whitelist" } as any, "ip")).toThrow();
    });

    test("cleaned array empty throws for port", () => {
        expect(() => validateRules({ values: ["a", "b"], mode: "whitelist" }, "port")).toThrow(/Cleaned array is empty/);
    });
});


