import app from "./app";
import dotenv from "dotenv";
import { logger } from "./src/utils/logger";

dotenv.config();

app.listen(process.env.PORT, () => {
  logger.info(`server is running at port: ${process.env.PORT}`);
});
