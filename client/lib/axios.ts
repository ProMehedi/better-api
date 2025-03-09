import axios from 'axios'
import { API_URL, API_VERSION } from '~/lib/constants'
import { authClient } from '~/lib/auth' // Better Auth client instance
import { redirect } from 'next/navigation'

const Axios = axios.create({
  baseURL: API_VERSION + API_URL,
  headers: {
    Accept: 'application/json',
  },
  // Important: Allow cookies to be sent with requests
  withCredentials: true,
})

// Request interceptor (simplified - no need to manually add auth token)
Axios.interceptors.request.use(
  async (config) => {
    // No need to manually add authorization header
    // Better Auth will handle cookies automatically
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle unauthorized responses
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear the session via Better Auth client
      authClient.signOut()
      redirect('/auth/login')
    }
    return Promise.reject(
      error.response?.data || error.message || 'Something went wrong'
    )
  }
)

export default Axios
