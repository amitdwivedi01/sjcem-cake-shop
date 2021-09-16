const express = require('express')
const path = require('path');
const app = express()

//Ejs initialization
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Serving Static files
app.use(express.static(__dirname + '/public'));

app.get("/" , (req, res) => {
    res.render("index")
})

app.listen(4000, () => {
    console.log("server started at 4000")
})