import './App.css'
import { Route, Routes} from "react-router-dom";
import ExampleComponent from './components/example-component/Example';
import { LoginPage } from './pages/login/loginPage';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={ <ExampleComponent/> }/>
      <Route path='/login' element={ <LoginPage/>}/>
    </Routes>
    </>
  )
}

export default App;
