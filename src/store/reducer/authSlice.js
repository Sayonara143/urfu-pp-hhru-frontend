import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        error: null,
        isLoading: false,
        isAuth: false,
        role: "",
        user: {},
    },
    reducers: {
        setIsLoading(state,action){
            state.isLoading = action.payload
        },
        setIsAuth(state,action){
            state.isAuth = action.payload
        },
        setRole(state,action){
            state.role = action.payload
        },
        setUser(state,action){
            state.user = action.payload
        },
        addError(state,action){
            state.error = action.payload
        },
    }
})
export default authSlice.reducer
export const authActions = authSlice.actions