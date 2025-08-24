import express, { Request, Response } from "express"
import { query } from "./db";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running just fine!");
})

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