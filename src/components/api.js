import axios from 'axios';

const AUTH_TOKEN = 'yoL2vTBeltOCnnQHK08o';

const axiosInstance = axios.create({
    headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
    }
});


export { axiosInstance }