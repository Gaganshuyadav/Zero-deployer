import { userThunk } from "@/redux/features/thunks/user";
import type { AppDispatch } from "@/redux/store";
import type { UserStateType } from "@/types/redux.type";
import { use, useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector} from "react-redux";
import { Navigate } from "react-router";


const Auth = ({ children}:{ children:ReactNode})=>{

    const dispatch = useDispatch<AppDispatch>();
    const [ firstRender, setFirstRender] = useState(true);
    const { user, isUserLoading, isAuthenticated} = useSelector((state:{ user:UserStateType})=>(state.user)); 


    useEffect(()=>{
        dispatch( userThunk.refreshAuth({}));
        setFirstRender(false);
    },[]);

    console.log("*****user*** ",  user);



    if( isUserLoading || firstRender){
        return(
            <div className="w-[100vw] h-[100vh] bg-zinc-500"></div>  
        ) 
    }
    else{
        if( isAuthenticated){
            return <div>{children}</div>
        }
        else{
            return <Navigate to={"/login"} />
        }
           
    }
}

export { Auth};