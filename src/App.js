import React, {Component} from 'react';
import './style.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Game from "./pages/Game";
import Main from './pages/Main'
import Rating from "./pages/Rating";
import PageNotFound from "./pages/404";
import Alert from 'react-s-alert';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Alert stack={{limit: 4}} effect={'slide'} />
                <Switch>
                    <Route path={'/'} component={Main} exact={true}/>
                    <Route path={'/game'} component={Game}/>
                    <Route path={'/rating'} component={Rating}/>
                    <Route path={"/oauth2/redirect"} component={OAuth2RedirectHandler}/>
                    <Route path={'/'} component={PageNotFound}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
