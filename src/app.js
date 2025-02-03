import express from "express";
import { route as movieRoutes } from "./modules/movies/routes.js";
import { route as theaterRoutes } from "./modules/theaters/routes.js";

const app = express();

app.use("/movies", movieRoutes);
app.use("/theaters", theaterRoutes);

export { app };
