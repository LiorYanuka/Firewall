import express, { Request, Response } from "express"
import { query } from "./db"
import ipRoutes from "./routes/ip.route"
import urlRoutes from "./routes/url.route"
import portRoutes from "./routes/port.route"
import rulesRoutes from "./routes/rules.route"


const app = express();
app.use(express.json());

app.use('/api/firewall/ip', ipRoutes);
app.use('/api/firewall/url', urlRoutes);
app.use('/api/firewall/port', portRoutes);
app.use('/api/firewall/rules', rulesRoutes);


// app.get("/", (req: Request, res: Response) => {
//     res.send("Server is running just fine!");
// })

export default app;