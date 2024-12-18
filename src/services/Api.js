import axios from "axios";
import { store } from "../store";
import { authActions } from "../store/reducer/authSlice";

// http://localhost:8080/ http://185.119.58.19
export const instanceWithToken = axios.create({
	withCredentials: true,
	baseURL: 'http://localhost:8000/'
});
instanceWithToken.interceptors.request.use(config => {
	config.headers.Authorization = "Bearer " + localStorage.getItem("token")
	return config
})

instanceWithToken.interceptors.response.use(
	config => {
		// console.clear()
		return config
	},
	async error => {
		const originalRequest = error.config
		
		if(error.response.status === 401 && error.config && !error._isRetry){
			originalRequest._isRetry = true
			localStorage.removeItem('token')
            store.dispatch(authActions.setIsAuth(false))
            // authActions.changeIsAdmin(false))
			// store.dispatch(actionAPI.changeIsAuth(false,true))
		}
		throw error
	}
)
export const instance = axios.create({
	withCredentials: false,
	baseURL: process.env.NODE_ENV === 'production'? `http://185.119.58.19`:'http://localhost:8000/',
});






