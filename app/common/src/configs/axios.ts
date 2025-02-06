import axios from 'axios'

const http = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

http.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error)
    }
);

http.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error)
);


export { http }
