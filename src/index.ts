import app from "./server";
import { config } from "./config/env";
import logger from "./config/logger";

app.listen(config.port, () => {
  logger.info(
    `Server is running on localhost:${config.port} in ${config.env} mode`
  );
});
