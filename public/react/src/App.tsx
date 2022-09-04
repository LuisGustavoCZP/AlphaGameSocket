import reactLogo from './assets/react.svg'
import './App.css'
import GlobalContext, { GlobalContextProvider } from './contexts/global-context'
import { MainRoom } from './components/main-room'

function App() {

  return (
    <div className="App">
      <GlobalContextProvider page={0}>
        <MainRoom />
      </GlobalContextProvider>
    </div>
  )
}

export default App
