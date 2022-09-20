import reactLogo from './assets/react.svg'
import './index.css'
import GlobalContext, { GlobalContextProvider } from './contexts/global-context'
import { MainRoom } from './components/main-room'
import { Router } from './routes/routes';
import { BrowserRouter } from 'react-router-dom';
function App() {

  return (
    <div>
      <GlobalContextProvider page={0}>
      <BrowserRouter>
          <Router />
      </BrowserRouter>
      </GlobalContextProvider>
    </div>
  )
}

export default App
