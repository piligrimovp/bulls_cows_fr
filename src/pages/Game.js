import React from "react";
import Header from "../components/Header";
import GameComponent from '../components/Game'

export default class Game extends React.Component {
    render() {
        return <section>
            <Header/>
            <GameComponent/>
        </section>
    }
}