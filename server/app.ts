import express from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

import cors from "cors";
import http from "http";
import reservationRoutes from "./src/reservation/reservation.route";
import orderRoutes from "./src/order/order.route";
import employeeRoutes from "./src/employee/employee.route";
import customerRoutes from "./src/customer/customer.route";

const app = express();

const rateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many request from this IP, please try again later" },
  standardHeaders: true,
  legacyHeaders: true,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(rateLimiter);
// app.use(helmet());
// app.use(morgan("dev"));

// app.use("/api/customer", customerRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/customer", customerRoutes);

export default app;
