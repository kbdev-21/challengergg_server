//import
import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import accountsRoutes from "./routes/accountsRoutes.js";
import matchesRoutes from "./routes/matchesRoutes.js";
import championsRoutes from "./routes/championsRoutes.js";
import "./schedule/statsUpdateSchedule.js";

//init
const app = express();

//middleware
app.use(json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

//routes init
app.use("/", accountsRoutes);
app.use("/", matchesRoutes);
app.use("/", championsRoutes);

//start the server
const port = process.env.PORT || 666;
const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING;
async function start() {
  try {
    //connect to mongodb
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoDbConnectionString);
    console.log("MongoDB connected!");

    //start server
    app.listen(port, () => console.log("Server is on at port " + port + "!"));
  } catch (error) {
    console.log(error);
  }
}

start();
