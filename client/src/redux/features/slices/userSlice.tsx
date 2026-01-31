import type { UserStateType } from "@/types/redux.type";
import { createSlice } from "@reduxjs/toolkit";
import { userThunk} from "@/redux/features/thunks/user";

const initialState:UserStateType = {
    isUserLoading: false,
    isAuthenticated: false, 
    user: null,
    errors:[]
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoginAuth: ( state)=>{

            state.isUserLoading = false;
            state.isAuthenticated = false;
        }
    },
    extraReducers: ( builder)=>{

        //login user
        builder.addCase( userThunk.userLogin.pending, ( state)=>{
            state.isUserLoading = true;
        }),
        builder.addCase( userThunk.userLogin.fulfilled, ( state, action:any)=>{
            state.isUserLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        }),
        builder.addCase( userThunk.userLogin.rejected, ( state, action:any)=>{
            state.isUserLoading = false;
            if(action.payload?.errors && action.payload?.errors.length>0){
                state.errors.push(action.payload?.errors[0]);
            }
            else{
                state.errors.push(action.payload?.message);
            }
        
        })

    }
})


export const { setLoginAuth} = userSlice.actions;

export default userSlice.reducer;







