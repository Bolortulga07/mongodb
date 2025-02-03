import express from "express";
import { route as movieRoute } from "./modules/movies/routes/routes.js";
import { route as theaterRoute } from "./modules/theaters/routes/routes.js";

const app = express();

app.use("/movies", movieRoutes);
app.use("/theaters", theaterRoutes);

export { app };
