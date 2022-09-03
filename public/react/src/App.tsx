import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { MatchRoom } from './components/match-room'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <MatchRoom/>
    </div>
  )
}

export default App
