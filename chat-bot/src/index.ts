import { setGlobalOptions } from "firebase-functions"; // ✅ v1 root
import { onRequest } from "firebase-functions/v2/https"; // ✅ v2 API
import * as logger from "firebase-functions/logger";

// Global config for all v2 functions
setGlobalOptions({ maxInstances: 10 });

export const helloWorld = onRequest(
  { maxInstances: 10 },
  (request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
  }
);
