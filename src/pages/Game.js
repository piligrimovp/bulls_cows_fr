import React from "react";
import Header from "../components/Header";
import GameComponent from '../components/Game'
import {USER_AUTHORIZED} from "../constants";

class Game extends React.Component {
    render() {
        return <section>
            <Header/>
            <GameComponent {...this.props}/>
        </section>
    }
}

Game.contextType = USER_AUTHORIZED;

export default Game;