require('dotenv').config();

const express = require('express')
const path = require('path');
const { resourceUsage } = require('process');
const app = express()

//Ejs initialization
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Serving Static files
app.use(express.static(__dirname + '/public'));

app.get("/" , (req, res) => {
    res.render("index")
})

const port = process.env.PORT

app.listen(port, () => {
    console.log(`server started at ${port}`)
})