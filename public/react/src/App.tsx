import reactLogo from './assets/react.svg'
import './index.css'
import { MainRoom } from './components/main-room'
import { Router } from './routes/routes';
import { BrowserRouter } from 'react-router-dom';
import { GlobalContextProvider } from './contexts';
function App() {

  return (
    <div>
      <GlobalContextProvider>
        <BrowserRouter>
            <Router />
        </BrowserRouter>
      </GlobalContextProvider>
    </div>
  )
}

export default App
