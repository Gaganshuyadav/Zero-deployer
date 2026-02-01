import { InputError } from "@/components/common-components/errors/InputError"
import { Button } from "@/components/ui/button"
import {
  Dialog,
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
import { Navigate, useNavigate } from "react-router"
import { toast } from "sonner"
import z from "zod";

function RegisterPage() {

  const dispatch = useDispatch<AppDispatch>();
  const { errors, isUserLoading, isAuthenticated} = useSelector((state:{ user:UserStateType})=>(state.user))
  const navigate = useNavigate();

  const [ firstName, setFirstName] = useState("");
  const [ lastName, setLastName] = useState("");
  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");
  const [ validationErrors, setValidationErrors] = useState<{ firstName?:string, lastName?:string, email?:string, password?:string}>({});

  const handleUserLogin = ()=>{

    if(validateRegister()){
        return;
    }

    const formData = new FormData();
    formData.append("firstName",firstName);
    formData.append("lastName", lastName);
    formData.append("email",email);
    formData.append("password", password);
    dispatch( userThunk.userRegister(formData));
    setFirstName("");setEmail("");setLastName("");setPassword("");
  }

  const validateRegister = ():boolean =>{
    
    const registerSchema = z.object({
        firstName: z.string().min(1, "First Name is required"),
        lastName: z.string().optional(),
        email: z.string().email("Invalid email address").min(1,"Email is not provided"),
        password: z.string().min(4, "Password must be at least 4 characters")
    })

    const parse = registerSchema.safeParse({ firstName, lastName, email, password});

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

  //navigation
  if(isAuthenticated){
    navigate("/");
  }

  return (
    <Dialog open={true}>
      <form>
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">Register</DialogTitle>
            <DialogDescription>
              Shhh… the auth service is sleeping. Type quietly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            
            <div className="grid gap-3">
              <Label htmlFor="name-1">First Name</Label>
              <Input value={firstName} onChange={(e)=>{setFirstName(e.target.value); if(validationErrors.firstName){ validationErrors.firstName=""; } }}  id="name-1" name="name" placeholder="Enter First Name "/>
              { validationErrors.firstName && <InputError error={validationErrors.firstName}/>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name-2">Last Name</Label>
              <Input value={lastName}  onChange={(e)=>{setLastName(e.target.value); if(validationErrors.lastName){ validationErrors.lastName=""; } }} id="name-2" name="username" placeholder="Enter Last Name"/>
              { validationErrors.lastName && <InputError error={validationErrors.lastName}/>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input value={email} onChange={(e)=>{setEmail(e.target.value); if(validationErrors.email){ validationErrors.email=""; } }} id="email" name="email" placeholder="Enter Email"/>
              { validationErrors.email && <InputError error={validationErrors.email}/>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input value={password} onChange={(e)=>{setPassword(e.target.value); if(validationErrors.password){ validationErrors.password=""; } }} id="password" name="password" placeholder="Enter Password"/>
              { validationErrors.password && <InputError error={validationErrors.password}/>}
            </div>

          </div>
          <DialogFooter>
            {/* <Button onClick={()=>{ setOpenLoginPage(false)}} variant="outline">Cancel</Button> */}
            <Button disabled={isUserLoading} onClick={handleUserLogin}>Register</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}


export { RegisterPage};