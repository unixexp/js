import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        category: null,
        user: null,
        guest: null,
        isAuthorized: false
    },
    reducers: {
        setCategory(state, action) {
            state.category = action.payload
        },
        setUser(state, action) {
            state.user = action.payload
        },
        setGuest(state, action) {
            state.guest = action.payload
        },
        setIsAuthorized(state, action) {
            state.isAuthorized = action.payload
        }
    }
})

export const selectCategory = (state) => state.app.category
export const selectUser = (state) => state.app.user
export const selectGuest = (state) => state.app.guest
export const selectIsAuthorized = (state) => state.app.isAuthorized
export const { setCategory, setUser, setIsAuthorized, setGuest } = appSlice.actions

export default appSlice.reducer