import React, {Component} from 'react';
import './style.css';
import {BrowserRouter, Route, Switch,Redirect} from "react-router-dom";
import Game from "./pages/Game";
import Main from './pages/Main'
import Rating from "./pages/Rating";
import PageNotFound from "./pages/404";
import Alert from 'react-s-alert';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler'
import {getCurrentUser} from "./api/Utils"
import {ACCESS_TOKEN} from "./constants";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authorized: false,
            loading: true,
            user: {}
        }
    }

    componentDidMount() {
        getCurrentUser()
            .then(response => {
                this.setState({
                    user: response,
                    authorized: true,
                    loading: false
                });
            }).catch(error => {
            this.setState({
                loading: false
            });
        });
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);
        this.setState({
            authenticated: false,
            currentUser: null
        });
        Alert.success("Вы вышли из аккаунта");
    }

    render() {
        return (
            <BrowserRouter>
                <Alert stack={{limit: 4}} effect={'slide'} />
                <Switch>
                    <Route path={'/'} component={Main} exact={true}/>
                    <Route path={'/game'} authorized={this.state.authorized} user={this.state.user} component={Game}/>
                    <Route path={'/rating'} authorized={this.state.authorized} user={this.state.user} component={Rating}/>
                    <Route path={"/oauth2/redirect"} component={OAuth2RedirectHandler}/>
                    <Route path={"/logout"} component={() => {this.handleLogout(); return <Redirect to={'/'}/>}}/>
                    <Route path={'/'} component={PageNotFound}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
