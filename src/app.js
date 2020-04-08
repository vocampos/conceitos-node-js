const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, post, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    post,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, post, techs } = request.body;

  const repoIndex = repositories.findIndex((item) => item.id === id);

  if (repoIndex < 0) {
    response.status(400).send({ error: "Repository not found" });
  }

  const repository = {
    id,
    url,
    title,
    post,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex((item) => item.id === id);

  if (repoIndex < 0) {
    res.status(400).send({ error: "Repository not found" });
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((item) => item.id === id);

  if (repoIndex < 0) {
    response.status(400).send({ error: "Repository not found" });
  }

  repositories[repoIndex].likes += 1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
