require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const atlasRemote = process.env.ATLAS_URL;
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(atlasRemote);

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

const BlogPost = mongoose.model("blogs", blogSchema);

app.get("/", (req, res) => {
  BlogPost.find((err, blogsRes) => {
    if (!err) {
      let blogs = [];

      blogsRes.forEach((elmt, idx) => {
        const { id, title, content, createdAt } = elmt;
        let timestamp = new Date(createdAt);
        let date =
          timestamp.getDate() +
          "-" +
          (timestamp.getMonth() + 1) +
          "-" +
          timestamp.getFullYear();
        let time = timestamp.getHours() + ":" + timestamp.getMinutes();

        blogs.push({
          id: id,
          title: title,
          content: content,
          date: date,
          time: time,
        });
      });
      console.log(blogs);
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
  const deleteID = mongoose.Types.ObjectId(req.body.deleteID);

  BlogPost.deleteOne({ id: deleteID }, (err, result) => {
    if (!err) {
      res.redirect("/");
    } else {
      //Handle the error
      console.log("Error:", err);
      res.redirect("/oops");
    }
  });
});

app.listen(PORT, () => {
  console.log("Server Started on Port:3000");
});
