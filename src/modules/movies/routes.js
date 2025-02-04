import express from "express";
import { client } from "../../mongo.js";

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

route.get("/in", async (req, res) => {
  let { ratings, page = 1, limit = 10 } = req.query;
  page = Number(page);
  limit = Number(limit);
  ratings = Number(ratings);

  const movies = await movies_collection
    .find({ "imdb.rating": { $in: [ratings] } })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/gt", async (req, res) => {
  let { votesNumber, page = 1, limit = 10 } = req.query;
  page = Number(page);
  limit = Number(limit);
  votesNumber = Number(votesNumber);
  const movies = await movies_collection
    .find({
      "imdb.votes": { $gt: votesNumber },
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/lt", async (req, res) => {
  let { runTime, page = 1, limit = 10 } = req.query;
  page = Number(page);
  limit = Number(limit);
  runTime = Number(runTime);
  const movies = await movies_collection
    .find({ runtime: { $lt: runTime } })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/task8", async (req, res) => {
  let { director, page = 1, limit = 10 } = req.query;

  page = Number(page);
  limit = Number(limit);
  const movies = await movies_collection
    .find({ directors: { $in: [director] } })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort()
    .toArray();

  res.send(movies);
});

route.get("/sort", async (req, res) => {
  let { sort = "desc", page = 1, limit = 10 } = req.query;

  const sortQuery = { year: sort === "asc" ? 1 : -1 };

  page = Number(page);
  limit = Number(limit);

  const movies = await movies_collection
    .find({}, { projection: { title: 1, year: 1, _id: 0 } })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sortQuery)
    .toArray();

  res.send(movies);
});

route.get("/limit", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = Number(page);
  limit = Number(limit);
  const movies = await movies_collection
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/skip", async (req, res) => {
  let { page = 1, skip = 10, limit = 10 } = req.query;
  page = Number(page);
  limit = Number(limit);
  skip = Number(skip);
  const movies = await movies_collection
    .find()
    .skip((page - 1) * skip)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/paginate", async (req, res) => {
  let { page = 1, paginate = 10, limit = 10 } = req.query;
  page = Number(page);
  limit = Number(limit);
  paginate = Number(paginate);
  const movies = await movies_collection
    .find()
    .skip((page - 1) * paginate)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/awards", async (req, res) => {
  let { awards, limit = 10 } = req.query;
  awards = Number(awards);
  limit = Number(limit);
  const movies = await movies_collection
    .find(
      {
        "awards.wins": { $gt: awards },
      },
      { projection: { title: 1, awards: 1 } }
    )
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/language", async (req, res) => {
  let { language, page = 1, limit = 10 } = req.query;

  page = Number(page);
  limit = Number(limit);
  const movies = await movies_collection
    .find({ language: { $in: [language] } })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/fresh", async (req, res) => {
  let { fresh = 0, page = 1, limit = 10 } = req.query;

  fresh = Number(fresh);
  page = Number(page);
  limit = Number(limit);

  const movies = await movies_collection
    .find({ "tomatoes.rating": { $gt: fresh } })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/filter", async (req, res) => {
  let { genre, year, page = 1, limit = 10 } = req.query;

  let query = {};
  if (genre) query.genre = genre;
  if (year) query.year = Number(year);

  page = Number(page);
  limit = Number(limit);

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/cast", async (req, res) => {
  let { castMember, page = 1, limit = 10 } = req.query;

  page = Number(page);
  limit = Number(limit);

  const movies = await movies_collection
    .find({ cast: { $in: [castMember] } })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/plot", async (req, res) => {
  let { keyword, page = 1, limit = 10 } = req.query;

  page = Number(page);
  limit = Number(limit);

  const movies = await movies_collection
    .find({ plot: { $regex: keyword, $options: "i" } })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  res.send(movies);
});

route.get("/count", async (req, res) => {
  let { genre } = req.query;

  const count = await movies_collection.countDocuments({ genre });

  res.send({ genre, count });
});

export { route };
