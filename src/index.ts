import app from "./server";
import { config } from "./config/env";

app.listen(config.port, () => {
    console.log(`Server is running on localhost:${config.port} in ${config.env} mode`);
});