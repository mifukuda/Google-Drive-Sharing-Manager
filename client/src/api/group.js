import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/group',
})

// Upload HTML file containing group membership data
export const uploadGroupSnapshot = (payload) => api.post('/uploadgroupsnapshot', payload);
