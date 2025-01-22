
import './css/App.css'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChampionshipTool from './pages/ChampionshipTool'
import ChampionshipStart from './pages/ChampionshipStart'
import Leaderboard from './pages/Leaderboard'
import ChampionshipResume from './pages/ChampionshipResume'
import DownloadFile from "./pages/Downloadfile"
import NavBar from "./components/NavBar"

function App() {
  return (
    <div> 
      <NavBar />
    <main className= "main-content">
        <Routes>
            <Route path= "/" element= {<Home />}></Route>
            <Route path= "/Leaderboard" element= {<Leaderboard />}></Route>
            <Route path= "/ChampionshipTool" element= {<ChampionshipTool />}></Route>
            <Route path= "/StartChampionship" element={<ChampionshipStart />} />
            <Route path= "/ResumeChampionship" element={<ChampionshipResume />} />
            <Route path= "/DownloadFile" element={<DownloadFile />} />
        </Routes>
    </main>
    </div>
  )
}

export default App
