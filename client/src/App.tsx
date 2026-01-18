import './App.css'
import { Route, Routes} from "react-router-dom";
import ExampleComponent from './components/example-component/Example';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={ <ExampleComponent/> }/>
      <Route path='/login' />
    </Routes>
    </>
  )
}

export default App;
