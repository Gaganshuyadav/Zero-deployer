import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "@/utils/config/config";

//login

class UserThunk{

    public userLogin = createAsyncThunk("auth/login", async ( formData:any, { rejectWithValue})=>{
        try{
            const { data} = await axios.post(
                `${server}/auth/login`, 
                formData, 
                { withCredentials: true, headers: { "Content-Type":"application/json" }}
            );

            const { user, token} = data;
            localStorage.setItem("zero-deployer-Jwt-Token",token);
            return user;
        }
        catch(err:any){
            if(err?.response?.data){
                return rejectWithValue({ message: err?.response?.data?.message, errors: err?.response?.data?.errors})
            }
            else{
                return rejectWithValue({ message: err?.message})
            }
        }
    })

    public userRegister = createAsyncThunk("user/register", async ( formData:any, { rejectWithValue})=>{
        try{
            const { data} = await axios.post(
                `${server}/user/create`, 
                formData, 
                { withCredentials: true, headers: { "Content-Type":"application/json" }}
            );

            const { user, token} = data;
            localStorage.setItem("zero-deployer-Jwt-Token",token);
            return user;
        }
        catch(err:any){

            console.log("errrrr ", err);
            if(err?.response?.data){
                return rejectWithValue({ message: err?.response?.data?.message, errors: err?.response?.data?.errors})
            }
            else{
                return rejectWithValue({ message: err?.message})
            }
        }
    })

    public refreshAuth = createAsyncThunk("auth/refresh-auth", async ( formData:any, { rejectWithValue})=>{
        try{

            const token = localStorage.getItem("zero-deployer-Jwt-Token");
            const { data} = await axios.get(
                `${server}/auth/authenticate-token`, 
                { withCredentials: true, 
                  headers: { "Authorization":`Bearer ${token}`, "Content-Type":"application/json" }
                }
            );

            const { user} = data;
            return user;
        }
        catch(err:any){

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
