import reactLogo from './assets/react.svg'
import './index.css'
import { MainRoom } from './components/main-room'
import { Router } from './routes/routes';
import { BrowserRouter } from 'react-router-dom';
function App() {

  return (
    <div>
      <BrowserRouter>
          <Router />
      </BrowserRouter>
    </div>
  )
}

export default App
