import { jwtDecode } from "jwt-decode"
import { AuthAPI } from "../../services/authService"
import {authActions} from '../reducer/authSlice'
import { ClientAPI } from "../../services/clientService"

export const login = ({email, password}) =>  dispatch => {
		dispatch(authActions.setIsLoading(true))
        dispatch(authActions.addError(null))
        AuthAPI.login(email, password)
        .then((response)=> {
            localStorage.setItem("token", response.data.token);
            const ob = jwtDecode(response.data.token)
            dispatch(authActions.setIsAuth(true))
            dispatch(authActions.setRole(ob.role))
            
        })
        .catch((error)=>{
            dispatch(authActions.addError(error.response.data))
        })
        .finally(()=>{
            dispatch(authActions.setIsLoading(false))
        })
}


export const logout = () => (dispatch) =>{
    localStorage.removeItem("token");
    dispatch(authActions.setIsAuth(false))
}

export const sync = () => dispatch =>{
    dispatch(authActions.setIsLoading(true))
    const token = localStorage.getItem("token")
    let ob
    if ('string' == typeof token) {
        ob = jwtDecode(token)
    }
    
    if (!ob){
        dispatch(authActions.setIsAuth(false))
        return
    }

        AuthAPI.me()
		.then(response => {
            dispatch(authActions.setIsAuth(true))
		})
        .catch((error) => {
            dispatch(authActions.setIsAuth(false))
	    })
        .finally(()=>{
            dispatch(authActions.setIsLoading(false))
        })
    
    dispatch(authActions.setRole(ob.role))
	
}