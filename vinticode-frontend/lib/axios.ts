import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const api = axios.create({
    baseURL : `${process.env.BACKEND_URL}`,
    withCredentials : true
})

export default api