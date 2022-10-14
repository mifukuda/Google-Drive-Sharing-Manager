import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export const getSnapshot = () => api.get(`/getSnapshot/`)
const apis = {
    getSnapshot
}

export default apis;