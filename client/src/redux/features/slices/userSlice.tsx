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
    },
    extraReducers: ( builder)=>{

        //login user
        builder.addCase( userThunk.userLogin.pending, ( state)=>{
            state.isUserLoading = true;
        }),
        builder.addCase( userThunk.userLogin.fulfilled, ( state, action:any)=>{
            state.isUserLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        }),
        builder.addCase( userThunk.userLogin.rejected, ( state, action:any)=>{
            state.isUserLoading = false;
            if(action.payload?.errors && action.payload?.errors.length>0){
                state.errors.push(action.payload?.errors[0]);
            }
            else{
                state.errors.push(action.payload?.message);
            }
        
        }),



        //New user
        builder.addCase( userThunk.userRegister.pending, ( state)=>{
            state.isUserLoading = true;
        }),
        builder.addCase( userThunk.userRegister.fulfilled, ( state, action:any)=>{
            state.isUserLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload;

        }),
        builder.addCase( userThunk.userRegister.rejected, ( state, action:any)=>{
            state.isUserLoading = false;
            if(action.payload?.errors && action.payload?.errors.length>0){
                state.errors.push(action.payload?.errors[0]);
            }
            else{
                state.errors.push(action.payload?.message);
            }
        
        })




        // refresh User
        builder.addCase( userThunk.refreshAuth.pending, ( state)=>{
            state.isUserLoading = true;
        }),
        builder.addCase( userThunk.refreshAuth.fulfilled, ( state, action:any)=>{
            state.isUserLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        }),
        builder.addCase( userThunk.refreshAuth.rejected, ( state)=>{
            state.isUserLoading = false;
        
        })

    }
})


// export const { } = userSlice.actions;

export default userSlice.reducer;







