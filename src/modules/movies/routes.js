import express from "express";
import { client } from "../../../mongo.js";

const route = express.Router();

const database = client.db("sample_mflix");
const movies_collection = database.collection("movies");

route.get("/title", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    res.json({ success: false, message: "title required" });
  }

  const movie = await movies_collection.findOne({ title: { $eq: title } });

  res.json({ success: true, data: { movie } });
});

route.get("/genre", async (req, res) => {
  let { genre, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (!genre) {
    res.json({ success: false, message: "genre required" });
  }

  const query = { genres: { $eq: genre } };

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const movieCount = await movies_collection.countDocuments(query);

  res.json({
    success: true,
    pagination: { total: movieCount, page, limit, totalReturn: limit },
    data: { movies },
  });
});

route.get("/or", async (req, res) => {
  let { genre, page = 1, limit = 10, year } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  year = parseInt(year);

  if (!genre || !year) {
    res.json({ success: false, message: "genre or year required" });
  }

  const query = {
    $or: [{ genre: { $eq: genre } }, { year: { $eq: year } }],
  };

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const movieCount = await movies_collection.countDocuments(query);

  res.json({
    success: true,
    pagination: { total: movieCount, page, limit, totalReturn: limit },
    data: { movies },
  });
});

route.get("/task1", async (req, res) => {
  let { search } = req.query;

  const movie = await movies_collection.findOne({
    title: search,
  });

  res.send(movie);
});

route.get("/task2", async (req, res) => {
  let { genre, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const movies = await movies_collection
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

const generataeFilter = (params) => {
  let { year, genre } = params;

  const filter = {};

  if (year) {
    filter["year"] = { $gte: Number(year) };
  }

  if (genre) {
    filter["genres"] = { $eq: genre };
  }

  return filter;
};

route.get("/task4", async (req, res) => {
  let { year, page = 1, limit = 10 } = req.query;
  page = Number(page);
  year = Number(year);
  limit = Number(limit);

  const filter = generataeFilter(req.query);

  const movies = await movies_collection
    .find(filter)
    .project({ year: 1, genres: 1, _id: 0 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

export { route };
