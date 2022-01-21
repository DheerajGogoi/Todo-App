const { createSlice, configureStore } = require("@reduxjs/toolkit");

const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem("todo_app_user_cred")) ? true : false,
    user_cred: JSON.parse(localStorage.getItem("todo_app_user_cred")) || null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        login(state, actions){
            state.isLoggedIn = true;
            state.user_cred = actions.payload.user_cred;
            localStorage.setItem('todo_app_user_isLoggedIn', JSON.stringify(true));
            localStorage.setItem('todo_app_user_cred', JSON.stringify(actions.payload.user_cred));
        },
        logout(state, actions){
            state.isLoggedIn = false;
            state.user_cred = null;
            localStorage.removeItem('todo_app_user_isLoggedIn');
            localStorage.removeItem('todo_app_user_cred');
        }
    }
})

export const authActions = authSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
})

export default store;