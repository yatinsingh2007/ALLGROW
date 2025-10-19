const axios = require('axios');

const api = axios.create({
    host : "https://judge0-ce.p.rapidapi.com"
})

module.exports = { api }