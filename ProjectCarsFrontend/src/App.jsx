
import './css/App.css'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChampionshipTool from './pages/ChampionshipTool'
import ChampionshipStart from './pages/ChampionshipStart'
import NavBar from "./components/NavBar"

function App() {
  return (
    <div> 
      <NavBar />
    <main className= "main-content">
        <Routes>
            <Route path= "/" element= {<Home />}></Route>
            <Route path= "/ChampionshipTool" element= {<ChampionshipTool />}></Route>
            <Route path="/StartChampionship" element={<ChampionshipStart />} />
        </Routes>
    </main>
    </div>
  )
}

export default App
