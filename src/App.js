import React, {Component} from 'react';
import './style.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Header from "./components/Header";
import Game from "./pages/Game";
import Main from './pages/Main'
import Rating from "./pages/Rating";
import Auth from "./pages/Auth";
import PageNotFound from "./pages/404";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path={'/'} component={Main} exact={true}/>
                    <Route path={'/game'} component={Game}/>
                    <Route path={'/rating'} component={Rating}/>
                    <Route path={'/auth'} component={Auth}/>
                    <Route path={'/'} component={PageNotFound}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
