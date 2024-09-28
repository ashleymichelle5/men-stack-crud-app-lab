require("dotenv").config(); 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");


app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on("error", (err) => {
  console.log(`Failed to connect due to ${err}.`);
});

const Car = require("./models/cars.js");

app.get("/", (req, res) => {
    res.render("index.ejs");
  });

// I.N.D.U.C.E.S
//GET -  Index /cars
//GET -  New /cars/new
//DELETE -  Delete /cars/:id
//PUT -  Update /cars/:id
//POST -  Create /cars/
//GET - Edit /cars/:id/edit
//GET Show /cars/:id

//Index
app.get("/cars", async (req, res) => {
    const cars = await Car.find({}); 
    res.render("cars/index.ejs", {
      title: "This is the Cars page",
      allCars: cars,
    });
});

//New
app.get("/cars/new", (req, res) => {
    res.render("cars/new.ejs");
});

//delete
app.delete("/cars/:id", (req, res) => {
    Car.findByIdAndDelete(req.params.id).then((responseFromDb) => {
      console.log(responseFromDb);
      res.redirect("/cars");
    });
  });

//Put
app.put("/cars/:id", async (req, res) => {
    if (req.body.isAvailable === "on") {
      req.body.isAvailable = true;
    } else {
      req.body.isAvailable = false;
    }
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
  
    res.redirect(`/cars/${req.params.id}`);
  
});

//Post
app.post("/cars", async (req, res) => {
    console.log(req.body, "this is the req.body");
    if (req.body.isAvailable === "on") {
      req.body.isAvailable = true;
    } else {
      req.body.isAvailable = false;
    }
  
    const car = await Car.create(req.body);
    res.redirect("/cars"); 
});

//edit 
app.get("/cars/:id/edit", async (req, res) => {
    const car = await Car.findById(req.params.id);
    res.render("cars/edit.ejs", {
      car,
    });
});

// SHOW
app.get("/cars/:id", async (req, res) => {
    const car = await Car.findById(req.params.id);
    res.render("cars/show.ejs", {
      car,
    });
  });




  app.listen(3000, () =>
    console.log('Listening port 3000!')
);