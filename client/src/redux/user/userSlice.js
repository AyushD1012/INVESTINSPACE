import { createSlice } from "@reduxjs/toolkit";

const intialState={
    currentUser: null,
    error: null,
    loading: false

}


const userSlice= userSlice({
    name:'user',
    intialState,
    reducers:{
        signInStart: (state) => {
            state.loading= true;
        },
        signInSuccess: (state,action) =>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;

        },
        signInFailure: (state,action) => {
            state.error=action.payload;
            state.loading=false;
        }
    }
});

export const {signInStart,signInSuccess,signInFailure}=userSlice.actions;

export default userSlice.reducer;