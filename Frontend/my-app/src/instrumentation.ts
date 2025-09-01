import logger from "@/config/logger";

export async function register() {
  try {
    logger.info("Instrumentation register: initializing application");
  } catch (error) {
    console.error("Instrumentation failed during register", error);
  }
}


