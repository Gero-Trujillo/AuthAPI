import express from "express";
import morgan from 'morgan';
import { PORT } from "./config.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/Auth.routes.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
