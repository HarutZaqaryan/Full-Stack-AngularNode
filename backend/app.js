import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "123a",
      title: "Server-side post 1.0",
      content: "This is came from server :)",
    },
    {
      id: "456a",
      title: "Server-side post 2",
      content: "This is came from server :)",
    },
    {
      id: "789a",
      title: "Server-side post 3",
      content: "This is came from server :)",
    },
    {
      id: "987a",
      title: "Server-side post 4",
      content: "This is came from server :)",
    },
    {
      id: "654a",
      title: "Server-side post 5",
      content: "This is came from server :)",
    },
  ];

  res.status(200).json({
    message: "Posts fetched",
    posts,
  });
});

export default app;
