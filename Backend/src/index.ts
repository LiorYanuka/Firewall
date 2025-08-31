import app from "./server";
import { setupServer } from "./middleware/startup.middleware";

setupServer(app);
