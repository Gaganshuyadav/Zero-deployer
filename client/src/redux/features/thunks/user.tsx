import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "@/utils/config";

//login

class UserThunk{

    public userLogin = createAsyncThunk("user/login", async ( formData:any, { rejectWithValue})=>{
        try{
            const { data} = await axios.post(
                `http://localhost:3000/auth/login`, 
                formData, 
                { withCredentials: true, headers: { "Content-Type":"application/json" }}
            );

            console.log(" this is response:: ", data);
            return data;
        }
        catch(err:any){

            console.log("err ", err)

            if(err?.response?.data){
                return rejectWithValue({ message: err?.response?.data?.message, errors: err?.response?.data?.errors})
            }
            else{
                return rejectWithValue({ message: err?.message})
            }
        }
    })

}

const userThunk = new UserThunk();

export { userThunk};
