import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/user',
})

// Upload HTML file containing group membership data
export const getRecentSearches = () => api.get('/getsavedqueries');
export const saveSearch = (payload) => api.post('/savequery', payload)

// Access control policies
export const getAccessControlPolicies = () => api.get(`/getallacps/`); 
export const addAccessControlPolicy = (payload) => api.post(`/addacp/`, payload); 
export const deleteAccessControlPolicy = (payload) => api.post(`/deleteacp/`, payload); 

const userapis = {
    getRecentSearches,
    saveSearch,
    getAccessControlPolicies,
    addAccessControlPolicy,
    deleteAccessControlPolicy
}

export default userapis;