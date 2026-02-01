import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import store from './redux/store.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <Provider store={store}>
        <App />
        <Toaster/>
    </Provider>
    </BrowserRouter>
)
