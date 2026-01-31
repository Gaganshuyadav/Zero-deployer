// import { Button } from "@/components/ui/button"
// import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"



// export function LoginPage() {

//   return (
//     <FieldGroup className="border-red-300 border-4">
//       <Field>
//         <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
//         <Input id="fieldgroup-name" placeholder="Jordan Lee" />
//       </Field>
//       <Field>
//         <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
//         <Input
//           id="fieldgroup-email"
//           type="email"
//           placeholder="name@example.com"
//         />
//         <FieldDescription>
//           We&apos;ll send updates to this address.
//         </FieldDescription>
//       </Field>
//       <Field orientation="horizontal">
//         <Button type="reset" variant="outline">
//           Reset
//         </Button>
//         <Button type="submit">Submit</Button>
//       </Field>
//     </FieldGroup>
//   )
// }




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
import { use, useState } from "react"
import { useDispatch, useSelector} from "react-redux";

function LoginPage() {

  const dispatch = useDispatch<AppDispatch>();
  const {user, isUserLoading, isAuthenticated, errors} = useSelector((state:{ user:UserStateType})=>(state.user))

  const [ openLoginPage, setOpenLoginPage] = useState(true);

  const [ email, setEmail] = useState("");
  const [ password, setPassword] = useState("");

  const handleUserLogin = ()=>{
    dispatch( userThunk.userLogin({ email, password}));
  }

  return (
    <Dialog open={openLoginPage}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Login</DialogTitle>
            <DialogDescription>
              Shhh… the auth service is sleeping. Type quietly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            
            {/* <div className="grid gap-3">
              <Label htmlFor="name-1">First Name</Label>
              <Input id="name-1" name="name" placeholder="Enter First Name "/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name-2">Last Name</Label>
              <Input id="name-2" name="username" placeholder="Enter Last Name"/>
            </div> */}

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input value={email} onChange={(e)=>{setEmail(e.target.value)}} id="email" name="email" placeholder="Enter Email"/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Password</Label>
              <Input value={password} onChange={(e)=>{setPassword(e.target.value)}} id="username-1" name="username" placeholder="Enter Password"/>
            </div>

          </div>
          <DialogFooter>
            <Button onClick={()=>{ setOpenLoginPage(false)}} variant="outline">Cancel</Button>
            <Button onClick={handleUserLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </form>
      <div>{ JSON.stringify(user)}</div>
      <div>{ JSON.stringify(isAuthenticated)}</div>
      <div>{ JSON.stringify(isUserLoading)}</div>
      <div>{ JSON.stringify(errors)}</div>
    </Dialog>
  )
}


export { LoginPage};