import request from "supertest";
import express, { Express } from "express";
import { errorHandler } from "../src/middleware/error.middleware";
import {
  requestLoggingMiddleware,
  setupServer,
} from "../src/middleware/startup.middleware";
import {
  validateRules,
  ValidationError,
} from "../src/middleware/validation.middleware";
import { HTTP_STATUS } from "../src/types/constants";

// Mock the database and logging service
jest.mock("../src/db", () => ({
  database: {
    connectWithRetry: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("../src/services/logging.service", () => ({
  loggingService: {
    request: jest.fn(),
    serverStart: jest.fn(),
    error: jest.fn(),
    appError: jest.fn(),
  },
}));

describe("Middleware Tests", () => {
  describe("Error Middleware", () => {
    let app: express.Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
    });

    it("should handle ValidationError correctly", async () => {
      app.get("/test", () => {
        throw new ValidationError("Test validation error", { field: "test" });
      });
      app.use(errorHandler);

      const response = await request(app).get("/test");

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body).toEqual({
        error: "Test validation error",
        details: { field: "test" },
      });
    });

    it("should handle ApiError with custom status", async () => {
      const customError = new Error("Custom error") as any;
      customError.status = 418;

      app.get("/test", () => {
        throw customError;
      });
      app.use(errorHandler);

      const response = await request(app).get("/test");

      expect(response.status).toBe(418);
      expect(response.body).toEqual({ error: "Custom error" });
    });

    it("should handle generic errors with default status", async () => {
      app.get("/test", () => {
        throw new Error("Generic error");
      });
      app.use(errorHandler);

      const response = await request(app).get("/test");

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({ error: "Generic error" });
    });

    it("should handle errors without message", async () => {
      const errorWithoutMessage = {} as any;

      app.get("/test", () => {
        throw errorWithoutMessage;
      });
      app.use(errorHandler);

      const response = await request(app).get("/test");

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("Request Logging Middleware", () => {
    let app: express.Application;
    const mockLoggingService =
      require("../src/services/logging.service").loggingService;

    beforeEach(() => {
      app = express();
      app.use(requestLoggingMiddleware);
      app.get("/test", (req, res) =>
        res.status(200).json({ message: "success" })
      );
      jest.clearAllMocks();
    });

    it("should log request details", async () => {
      await request(app).get("/test");

      expect(mockLoggingService.request).toHaveBeenCalledWith({
        method: "GET",
        url: "/test",
        status: 200,
        duration: expect.stringMatching(/\d+ms/),
      });
    });

    it("should handle different HTTP methods", async () => {
      app.post("/test", (req, res) =>
        res.status(201).json({ message: "created" })
      );

      await request(app).post("/test");

      expect(mockLoggingService.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/test",
        status: 201,
        duration: expect.stringMatching(/\d+ms/),
      });
    });
  });

  describe("Startup Middleware", () => {
    let app: express.Application;
    const mockDatabase = require("../src/db").database;
    const mockLoggingService =
      require("../src/services/logging.service").loggingService;

    beforeEach(() => {
      app = express();
      jest.clearAllMocks();
    });

    it("should setup server with default options", async () => {
      const listenSpy = jest
        .spyOn(app, "listen")
        .mockImplementation((port, callback) => {
          if (callback) callback();
          return {} as any;
        });

      await setupServer(app as Express);

      expect(mockDatabase.connectWithRetry).toHaveBeenCalled();
      expect(listenSpy).toHaveBeenCalled();
      expect(mockLoggingService.serverStart).toHaveBeenCalled();
    });

    it("should setup server with custom options", async () => {
      const listenSpy = jest
        .spyOn(app, "listen")
        .mockImplementation((port, callback) => {
          if (callback) callback();
          return {} as any;
        });

      await setupServer(app as Express, { port: 4000, env: "test" });

      expect(mockDatabase.connectWithRetry).toHaveBeenCalled();
      expect(listenSpy).toHaveBeenCalledWith(4000, expect.any(Function));
      expect(mockLoggingService.serverStart).toHaveBeenCalledWith(4000, "test");
    });

    it("should handle database connection errors", async () => {
      const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("process.exit called");
      });

      mockDatabase.connectWithRetry.mockRejectedValue(
        new Error("DB connection failed")
      );

      await expect(setupServer(app as Express)).rejects.toThrow(
        "process.exit called"
      );

      expect(mockLoggingService.error).toHaveBeenCalledWith(
        "Failed to start server",
        { error: "Error: DB connection failed" }
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("Validation Middleware", () => {
    describe("IP Validation", () => {
      it("should validate valid IP addresses", () => {
        const data = { mode: "whitelist", values: ["192.168.1.1", "10.0.0.1"] };
        const result = validateRules(data, "ip");
        expect(result).toEqual(["192.168.1.1", "10.0.0.1"]);
      });

      it("should throw ValidationError for invalid IPs", () => {
        const data = {
          mode: "whitelist",
          values: ["invalid-ip", "192.168.1.1"],
        };
        expect(() => validateRules(data, "ip")).toThrow(ValidationError);
      });

      it("should throw ValidationError for empty values", () => {
        const data = { mode: "whitelist", values: [] };
        expect(() => validateRules(data, "ip")).toThrow(ValidationError);
      });
    });

    describe("URL Validation", () => {
      it("should validate and normalize URLs", () => {
        const data = {
          mode: "blacklist",
          values: ["example.com", "https://test.com/"],
        };
        const result = validateRules(data, "url");
        expect(result).toEqual(["https://example.com", "https://test.com"]);
      });

      it("should handle URLs with trailing slashes", () => {
        const data = {
          mode: "blacklist",
          values: ["https://example.com/", "http://test.com/path/"],
        };
        const result = validateRules(data, "url");
        expect(result).toEqual(["https://example.com", "http://test.com/path"]);
      });

      it("should throw ValidationError for invalid URLs", () => {
        const data = {
          mode: "blacklist",
          values: ["", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs without hostname", () => {
        const data = {
          mode: "blacklist",
          values: ["https://", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for malformed URLs", () => {
        const data = {
          mode: "blacklist",
          values: ["http://:8080", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs that cause URL constructor to fail", () => {
        const data = {
          mode: "blacklist",
          values: ["http://[invalid]", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs with invalid IPv6 format", () => {
        const data = {
          mode: "blacklist",
          values: ["http://[::1:invalid]", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs with empty hostname after normalization", () => {
        const data = {
          mode: "blacklist",
          values: ["http://", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs that result in empty hostname", () => {
        const data = {
          mode: "blacklist",
          values: ["http:///", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs with protocol but no hostname", () => {
        const data = {
          mode: "blacklist",
          values: ["http://", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs with empty hostname after URL construction", () => {
        const data = {
          mode: "blacklist",
          values: ["http:///path", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs that cause hostname to be empty", () => {
        const data = {
          mode: "blacklist",
          values: ["http://:8080", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs with invalid format that results in empty hostname", () => {
        const data = {
          mode: "blacklist",
          values: ["http:///", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });

      it("should throw ValidationError for URLs that cause URL constructor to succeed but hostname to be empty", () => {
        const data = {
          mode: "blacklist",
          values: ["http://:8080", "https://valid.com"],
        };
        expect(() => validateRules(data, "url")).toThrow(ValidationError);
      });
    });

    describe("Port Validation", () => {
      it("should validate valid ports", () => {
        const data = { mode: "whitelist", values: [80, 443, 8080] };
        const result = validateRules(data, "port");
        expect(result).toEqual([80, 443, 8080]);
      });

      it("should validate string ports", () => {
        const data = { mode: "whitelist", values: ["80", "443", "8080"] };
        const result = validateRules(data, "port");
        expect(result).toEqual([80, 443, 8080]);
      });

      it("should throw ValidationError for invalid ports", () => {
        const data = { mode: "whitelist", values: [70000, 80] };
        expect(() => validateRules(data, "port")).toThrow(ValidationError);
      });

      it("should throw ValidationError for non-numeric string ports", () => {
        const data = { mode: "whitelist", values: ["abc", 80] };
        expect(() => validateRules(data, "port")).toThrow(ValidationError);
      });
    });

    describe("Base Validation", () => {
      it("should throw ValidationError for missing mode", () => {
        const data = { values: ["192.168.1.1"] };
        expect(() => validateRules(data, "ip")).toThrow(ValidationError);
      });

      it("should throw ValidationError for invalid mode", () => {
        const data = { mode: "invalid", values: ["192.168.1.1"] };
        expect(() => validateRules(data, "ip")).toThrow(ValidationError);
      });
    });
  });
});
