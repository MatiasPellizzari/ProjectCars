
import './css/App.css'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChampionshipTool from './pages/ChampionshipTool'
import ChampionshipStart from './pages/ChampionshipStart'
import Leaderboard from './pages/Leaderboard'
import ChampionshipResume from './pages/ChampionshipResume'
import DownloadFile from "./pages/Downloadfile"
import NavBar from "./components/NavBar"
import ChampionshipUpdate from "./pages/ChampionshipUpdate"
import SeniorLeaderboard from './pages/SeniorLeaderboard'
import AddSenior from './pages/AddSenior'
import SetScoreList from './pages/ScoreListSetter'
import SetParticipationScore from './pages/ParticipationScoreSetter'

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
            <Route path= "/UpdateChampionship" element={<ChampionshipUpdate />} />
            <Route path= "/DownloadFile" element={<DownloadFile />} />
            <Route path= "/SeniorLeaderboard" element={<SeniorLeaderboard />} />
            <Route path= "/AddSenior" element={<AddSenior />} />
            <Route path= "/SetScores" element= {<SetScoreList />} />
            <Route path= "/SetParticipationScore" element= {<SetParticipationScore />} />
        </Routes>
    </main>
    </div>
  )
}

export default App
