const axios = require('axios');

axios.create({
    host : "https://judge0-ce.p.rapidapi.com"
})

module.exports = { axios }