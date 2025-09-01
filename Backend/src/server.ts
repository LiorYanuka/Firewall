import express, { Request, Response } from "express";
// import ipRoutes from "./routes/seperate/ip.route"
// import urlRoutes from "./routes/seperate/url.route"
// import portRoutes from "./routes/seperate/port.route"
import rulesRoutes from "./routes/rules.route";
import universalRoutes from "./routes/universal.route";
import { errorHandler } from "./middleware/error.middleware";
import { requestLoggingMiddleware } from "./middleware/startup.middleware";

const app = express();

app.use(express.json());
app.use(requestLoggingMiddleware);

// Minimal CORS to allow frontend dev server to talk to backend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running just fine!");
});

// app.use('/api/firewall/ip', ipRoutes);
// app.use('/api/firewall/url', urlRoutes);
// app.use('/api/firewall/port', portRoutes);

app.use("/api/firewall", rulesRoutes);
app.use("/api/firewall", universalRoutes);

// Error handling
app.use(errorHandler);

export default app;
