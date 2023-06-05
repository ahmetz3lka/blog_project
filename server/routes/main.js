const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "A Blog",
      description: "Blog Description",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

// GET Post
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });
    const locals = {
      title: data.title,
      description: "Blog Description",
    };
    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

// POST Search
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Blog Description",
    };
    let searchTerm = req.body.searchTerm;
    const senselessSearch = searchTerm.replace(/[^a-zA-z0-9 ]/g, "");
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(senselessSearch, "i") } },
        { title: { $regex: new RegExp(senselessSearch, "i") } },
      ],
    });
    res.render("search", { data, locals, currentRoute: "/" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});

module.exports = router;
