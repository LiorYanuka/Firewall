import express, { Request, Response } from "express"
import { query } from "./db"
import ipRoutes from "./routes/ip.route"
import urlRoutes from "./routes/url.route"


const app = express();
app.use(express.json());

app.use('/api/firewall/ip', ipRoutes);
app.use('/api/firewall/url', urlRoutes);


// app.get("/", (req: Request, res: Response) => {
//     res.send("Server is running just fine!");
// })

// app.get("/users", async (req, res) => {
//   try {
//     const result = await query("SELECT * FROM users");
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

export default app;