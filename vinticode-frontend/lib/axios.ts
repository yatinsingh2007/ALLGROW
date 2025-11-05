import axios from "axios";

const api = axios.create({
    baseURL : "https://vinti-code.vercel.app/api"
})

export default api