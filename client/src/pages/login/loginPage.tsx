
import { InputError } from "@/components/common-components/errors/InputError"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userThunk } from "@/redux/features/thunks/user"
import type { AppDispatch } from "@/redux/store"
import type { UserStateType } from "@/types/redux.type"
import { useEffect, useState } from "react"
import { useDispatch, useSelector} from "react-redux";
import z from "zod";
import { toast } from "sonner"
import { useNavigate } from "react-router"

function LoginPage() {

  const dispatch = useDispatch<AppDispatch>();
  const {isUserLoading, errors, isAuthenticated} = useSelector((state:{ user:UserStateType})=>(state.user));
  const navigate = useNavigate();

  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");
  const [ validationErrors, setValidationErrors] = useState<{email?:string, password?:string}>({});

  const handleUserLogin = ()=>{
    if(validateLogin()){
      return;
    }
    dispatch( userThunk.userLogin({ email, password}));
    setEmail("");setPassword("");
  }


  const validateLogin = ():boolean =>{
      
      const registerSchema = z.object({
          email: z.string().email("Invalid email address").min(1,"Email is not provided"),
          password: z.string().min(4, "Password must be at least 4 characters")
      })
  
      const parse = registerSchema.safeParse({ email, password});
  
      if(parse?.error?.message){
          const zodErrorList = JSON.parse(parse.error?.message);
          if( zodErrorList.length > 0){
              const getErrors:Array<any> = zodErrorList.map((error:any)=>{
                  return { [error.path[0]]: error.message };
              })
  
              const getErrorsObj = getErrors.reduce((prev,curr)=>{
                  return { ...prev, ...curr};
              },{});
  
              setValidationErrors(getErrorsObj);
              return true;
          }
      }
  
      return false;
  
    
  }


  useEffect(()=>{
    if(errors.length>0){
        toast.error(errors[0]);
    }
  } , [ errors]);

  // navigation
  if(isAuthenticated){
    navigate("/");
  }
  

  return (
    <Dialog open={true}>
      <form>
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">Login</DialogTitle>
            <DialogDescription>
              Shhh… the auth service is sleeping. Type quietly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input value={email} onChange={(e)=>{setEmail(e.target.value); if(validationErrors.email){ validationErrors.email=""; }}} id="email" name="email" placeholder="Enter Email"/>
              { validationErrors.email && <InputError error={validationErrors.email}/>}
            </div>
             <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input value={password} onChange={(e)=>{setPassword(e.target.value); if(validationErrors.password){ validationErrors.password=""; } }} id="password" name="password" placeholder="Enter Password"/>
              { validationErrors.password && <InputError error={validationErrors.password}/>}
            </div>

          </div>
          <DialogFooter>
            <Button disabled={isUserLoading} onClick={handleUserLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}


export { LoginPage};