import './App.css'
import { Route, Routes} from "react-router-dom";
import ExampleComponent from './components/example-component/Example';
import { LoginPage } from './pages/login/loginPage';
import { RegisterPage } from './pages/register/Register';
import { Auth } from './utils/auth-refresh-route/Auth';
import Deployments from './pages/dashboard/Deployments';
import Integrations from './pages/dashboard/Integrations';
import Overview from './pages/dashboard/Overview';
import Projects from './pages/dashboard/Projects';
import Settings from './pages/dashboard/Settings';
import Teams from './pages/dashboard/Teams';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={ <Auth><ExampleComponent/></Auth> }/>
      <Route path='/login' element={ <LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>} />


      <Route path='/deployments' element={ <Deployments/>}/>
      <Route path='/integrations' element={<Integrations/>} />
      <Route path='/overview' element={ <Overview/>}/>
      <Route path='/projects' element={<Projects/>} />
      <Route path='/settings' element={ <Settings/>}/>
      <Route path='/teams' element={<Teams/>} />


    </Routes>
    </>
  )
}

export default App;
