const mongoose = require('mongoose');

require('dotenv').config()
const url = process.env.DATABASE_URL;

mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err))

