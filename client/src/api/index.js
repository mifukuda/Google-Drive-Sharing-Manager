// All backend calls
import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// Get default snapshot
export const getSnapshot = () => api.get('/getSnapshot/');
// Apply filter to snapshot
export const getFilteredSnapshot = (id, payload) => api.post(`/query`, payload);

const apis = {
    getSnapshot,
    getFilteredSnapshot
}
export default apis;