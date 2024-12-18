import { instance, instanceWithToken } from "./Api"

export const AuthAPI = {
    login(email, password){
		return  instance.post(`/auth/login`, {email, password})
	},
	logout(){
		return instanceWithToken.get(`api/v0/admin/logout`)
	},
	register (data)  {
			return instance.post(`/auth/register`, data)
	},
	me(){
		return instanceWithToken.get(`auth/me`)
	}
}