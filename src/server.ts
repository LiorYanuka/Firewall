import express, { NextFunction, Request, Response } from "express"
// import ipRoutes from "./routes/seperate/ip.route"
// import urlRoutes from "./routes/seperate/url.route"
// import portRoutes from "./routes/seperate/port.route"
import rulesRoutes from "./routes/rules.route"
import universalRoutes from "./routes/universal.route"
import logger from "./config/logger";


const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running just fine!");
})

// app.use('/api/firewall/ip', ipRoutes);
// app.use('/api/firewall/url', urlRoutes);
// app.use('/api/firewall/port', portRoutes);

app.use('/api/firewall', rulesRoutes);
app.use('/api/firewall', universalRoutes);

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status && Number.isInteger(err.status) ? err.status : 500;
    const message = err?.message ?? "Internal Server Error";
    logger.error("Unhandled error", { status, message, stack: err?.stack });
    res.status(status).json({ error: message });
});

export default app;