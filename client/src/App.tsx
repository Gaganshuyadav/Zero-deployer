import './App.css'
import { Route, Routes} from "react-router-dom";
import ExampleComponent from './components/example-component/Example';
import { LoginPage } from './pages/login/loginPage';
import { RegisterPage } from './pages/register/Register';
import { Auth } from './utils/auth-refresh-route/Auth';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={ <Auth><ExampleComponent/></Auth> }/>
      <Route path='/login' element={ <LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>} />
    </Routes>
    </>
  )
}

export default App;
