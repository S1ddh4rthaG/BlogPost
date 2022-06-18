const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/blogs");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BlogPost = mongoose.model("blogposts", blogSchema);

app.get("/", (req, res) => {
  BlogPost.find((err, blogs) => {
    if (!err) {
      res.render("index.ejs", { blogs: blogs });
    } else {
      //Handle the error
      console.log("Error:", err);
      res.redirect("/oops");
    }
  });
});

app.post("/create", (req, res) => {
  const { title, content } = req.body;

  const userPost = BlogPost({
    title: title,
    content: content,
  });

  userPost.save((err) => {
    if (!err) {
      res.redirect("/");
    } else {
      //Handle the error
      console.log("Error:", err);
      res.redirect("/oops");
    }
  });
});

app.post("/delete", (req, res) => {
  const { deleteTitle } = req.body;

  BlogPost.remove({ title: deleteTitle }, (err, result) => {
    if (!err) {
      res.redirect("/");
    } else {
      //Handle the error
      console.log("Error:", err);
      res.redirect("/oops");
    }
  });
});

app.get("/:articleName", (req, res) => {
  const articleName = req.params.articleName;

  BlogPost.find({ title: articleName }, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      //Handle the error
      console.log("Error:", err);
      res.redirect("/oops");
    }
  });
});

app.listen(3000, () => {
  console.log("Server Started on Port:3000");
});
