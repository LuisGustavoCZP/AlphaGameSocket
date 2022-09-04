import reactLogo from './assets/react.svg'
import './index.css'
import GlobalContext, { GlobalContextProvider } from './contexts/global-context'
import { MainRoom } from './components/main-room'

function App() {

  return (
    <div>
      <GlobalContextProvider page={0}>
        <MainRoom />
      </GlobalContextProvider>
    </div>
  )
}

export default App
