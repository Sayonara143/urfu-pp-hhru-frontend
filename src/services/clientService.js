import { instanceWithToken } from "./Api"

export const ClientAPI = {
	getListVacancy(){
		return  instanceWithToken.get(`vacancies`)
	},
	getListOrder(id){
		return  instanceWithToken.get(`orders?client-id=${id}`)
	},
	getClient(id) {
		return instanceWithToken.get(`clients/${id}`)
	},
	changeClient(id, data) {
		return instanceWithToken.put(`clients/${id}`, data)
	},
	createOrder(data) {
		return instanceWithToken.post('orders', data)
	}
}