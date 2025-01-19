import { Link } from "react-router-dom";

function NavBar() {
     return <nav className= "navbar">
            <div className= "navbar-brand">
                 <Link to = "/"> Home </Link>
            </div>
            <div className= "navbar-brand">
                 <Link to = "/ChampionshipTool"> ChampionShip Tool </Link>
            </div>
            
    </nav>


}

export default NavBar