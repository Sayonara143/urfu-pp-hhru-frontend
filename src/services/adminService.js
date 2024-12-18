import { instanceWithToken } from "./Api"

export const AdminAPI = {
	staff: {
		delete(id){
			return  instanceWithToken.delete(`users/${id}`)
		},
		create(data){
			return  instanceWithToken.post(`auth/register/user`, data)
		},
		edit(id, data){
			return  instanceWithToken.put(`users/${id}`, data)
		},
		list(){
			return  instanceWithToken.get(`users`)
		},
	},
	product: {
		edit(id,data){
			return  instanceWithToken.put(`products/${id}`, data)
		},
		create(data){
			return  instanceWithToken.post(`products`,data)
		},
		list() {
			return  instanceWithToken.get(`products`)
		}
	},
	order: {
		edit(id,data){
			return  instanceWithToken.put(`orders/${id}`, data)
		},
		list() {
			return  instanceWithToken.get(`orders`)
		}
	},
	status: {
		list(){
			return  instanceWithToken.get(`statutes`)
		}
	},
	orderDevelopment: {
		edit(id,data){
			return  instanceWithToken.put(`orders-development/${id}`, data)
		},
		list() {
			return  instanceWithToken.get(`orders-development`)
		}
	}

}
