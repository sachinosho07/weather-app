const express = require("express");
// const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    let locDate = { temp: "Temp", disc: "Discription", location: "Location", humidity: "Humidity ", feel: "Feel ", speed: "Speed" };
    res.render("index", { locDate: locDate,});
});

app.post("/",async function(req, res){
    const city = await req.body.city;
    res.redirect(`/weather/${city}`);
});

app.get("/weather/:city",async  function(req, res){
    try {
        const location = await req.params.city;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
        let response = await fetch(url);
        let data = await response.json();
        // console.log(data);
        let locDate = {};
        locDate.temp = Math.floor(data.main.temp);
        locDate.disc = data.weather[0].description;
        locDate.feel = data.main.feels_like;
        locDate.humidity = data.main.humidity;
        locDate.speed = data.wind.speed;
        locDate.location = location;
        // console.log(locDate);
        res.render("index", { locDate: locDate,});
    } catch (err) {
        console.log(err);
        res.status(400).json({ data: 'not found!' })
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server is running....");
});