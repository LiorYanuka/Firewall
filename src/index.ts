import app from "./server";
import { config } from "./config/env";
import './config/logger';

app.listen(config.port, () => {
    console.log(`Server is running on localhost:${config.port} in ${config.env} mode`);
});