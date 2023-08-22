const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8100;

app.use(express.json());

//Get a single Todo
app.get("/todos/:id", (req, res) => {
  try {
    const todoId = req.params.id;
    const dbData = JSON.parse(fs.readFileSync("./database.json").toString());
    const todoArr = dbData.todos;
    const filterArr = todoArr.filter((item) => item.id == todoId);
    res.status(200).json({ message: "ok", data: filterArr });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get all Todos
app.get("/todos", (req, res) => {
  try {
    const dbData = JSON.parse(fs.readFileSync("./database.json").toString());
    res.status(200).json({ message: "Success", data: dbData.todos });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
//Port add todo
app.post("/todos", (req, res) => {
  try {
    const newTodo = req.body;
    const dbData = JSON.parse(fs.readFileSync("./database.json").toString());
    dbData.todos.push(newTodo);
    fs.writeFileSync("./database.json", JSON.stringify(dbData));
    res.status(200).send("todo added");
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
//Put update a single Todo
app.put("/todos/:id", (req, res) => {
  try {
    const todoId = req.params.id;
    let dbData = JSON.parse(fs.readFileSync("database.json").toString());
    let todo = dbData.todos;
    const { name, isDone } = req.body;
    let updateTodo = todo.map((item) => {
      if (todoId == item.id) {
        item.name = name;
        item.isDone = isDone;
      }
      return item;
    });
    dbData.todos = updateTodo;
    fs.writeFileSync("database.json", JSON.stringify(dbData));
    res
      .status(200)
      .send({ message: "Todo updated successfully", data: dbData });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
//Delete a single Todo
app.delete("/todos/:id", (req, res) => {
  try {
    const todoId = req.params.id;
    let dbData = JSON.parse(fs.readFileSync("./database.json").toString());
    const todoArr = dbData.todos;
    const filterArr = todoArr.filter((item) => item.id != todoId);
    dbData.todos = filterArr;
    fs.writeFileSync("./database.json", JSON.stringify(dbData));
    res.status(200).json({ message: "deleted todo", data: filterArr });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.listen(PORT, () => console.log("listening on port", PORT));
