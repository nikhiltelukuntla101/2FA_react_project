import express, { urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnect } from "./config/dbConnect.js";
import router from "./routes/authRoutes.js";
import "./config/passportConfig.js";

dotenv.config();
dbConnect();

const app = express();

//Middlewares
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/auth", router);

// Listen app
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
