import { userThunk } from "@/redux/features/thunks/user";
import type { AppDispatch } from "@/redux/store";
import type { UserStateType } from "@/types/redux.type";
import { use, useEffect, type ReactNode } from "react";
import { useDispatch, useSelector} from "react-redux";


const Auth = ({ children}:{ children:ReactNode})=>{

    const dispatch = useDispatch<AppDispatch>();
    const { user} = useSelector((state:{ user:UserStateType})=>(state.user)); 


    useEffect(()=>{
        dispatch( userThunk.refreshAuth({}));
    },[]);

    console.log("*****user*** ",  user);


    return(
        <div className="w-[100vw] h-[100vh] bg-zinc-500"></div>
        
    )
}

export { Auth};