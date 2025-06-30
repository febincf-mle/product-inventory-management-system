import axios from "axios";


// Create an Axios instance with a base URL for the API.
const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    headers: {
        'Content-Type': 'application/json',
    }
})

// Create an Axios request interceptor to add the
// Authorization header with the access token to each request.
axiosInstance.interceptors.request.use(
    function (config) {
        // Retrieve the access token from localStorage.
        const accessToken = localStorage.getItem("access-token");
        
        // If the access token exists, add it to the Authorization header.
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        // Handle any errors that occur during the request.
        return Promise.reject(error);
    }
)

// Create an Axios response interceptor to handle errors globally.
axiosInstance.interceptors.response.use(

    function (response) {
        // If the response is successful, return it.
        return response;
    },

    async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest.retry) {

            // If the response status is 401 (Unauthorized) and the request has not been retried,
            // it indicates that the access token may have expired.
            originalRequest.retry = true;
            const refreshToken = localStorage.getItem("refresh-token");

            // If a refresh token exists, attempt to refresh the access token.
            try {
                const response = await axiosInstance.post('token/refresh/', {refresh: refreshToken})
                localStorage.setItem("access-token", response.data.access);

                // Update the Authorization header with the new access token.
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

                // Retry the original request with the new access token.
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refreshing the token fails, clear the tokens
                // from the local storage and redirect the user to the login page.
                localStorage.removeItem("access-token");
                localStorage.removeItem("refresh-token");
            }
        }
        // Reject the promise with the error.
        return Promise.reject(error);
    }
);


export default axiosInstance;