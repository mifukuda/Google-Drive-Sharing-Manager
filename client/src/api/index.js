import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export const getSnapshot = () => api.get('/getSnapshot/');
export const getFilteredSnapshot = (id, payload) => api.post(`/getSnapshot/${id}`, payload);

const apis = {
    getSnapshot,
    getFilteredSnapshot
}
export default apis;