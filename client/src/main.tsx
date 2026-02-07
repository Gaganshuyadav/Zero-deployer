import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import store from './redux/store.tsx'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/theme-context/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ThemeProvider>
            <Provider store={store}>
                <App />
                <Toaster/>
            </Provider>
        </ThemeProvider>
    </BrowserRouter>
)
