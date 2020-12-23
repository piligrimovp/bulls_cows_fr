import React from "react";
import Header from "../components/Header";
import GameComponent from '../components/Game'

export default class Game extends React.Component {
    render() {
        return <section>
            <Header authorized={this.props.authorized} user={this.props.user}/>
            <GameComponent/>
        </section>
    }
}