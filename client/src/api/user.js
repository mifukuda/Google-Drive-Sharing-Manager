import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/user',
})

// Upload HTML file containing group membership data
export const getRecentSearches = () => api.get('/getsavedqueries');
export const saveSearch = (payload) => api.post('/savequery', payload)

const userapis = {
    getRecentSearches,
    saveSearch
}

export default userapis;