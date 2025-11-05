import axios from "axios";

const api = axios.create({
    baseURL : "https://vinti-code.vercel.app/api" ,
    withCredentials : true
})

export default api