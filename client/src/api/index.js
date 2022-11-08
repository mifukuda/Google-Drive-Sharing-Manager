// All backend calls
import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/fileSnapshot',
})

// Get info of all user's snapshots
export const getAllSnaphotInfo = () => api.get('/getinfo/');
// Create snapshot
export const createSnapshot = (payload) => api.post('/create/', payload);
// Get default snapshot
export const getSnapshot = (payload) => api.post('/get/', payload);
// Apply filter to snapshot
export const getFilteredSnapshot = (payload) => api.post('/query/', payload);

// Get all access control policies
export const getAccessControlPolicies = () => api.get(`/getAccessControlPolicies/`) 
export const addAccessControlPolicy = () => api.post(`/addAccessControlPolicy/`) 

const apis = {
    createSnapshot,
    getAllSnaphotInfo,
    getSnapshot,
    getFilteredSnapshot,
    getAccessControlPolicies,
    addAccessControlPolicy
}

export default apis;