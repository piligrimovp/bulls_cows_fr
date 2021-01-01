import React, {Component} from 'react';
import './style.css';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Game from "./pages/Game";
import Main from './pages/Main'
import Rating from "./pages/Rating";
import PageNotFound from "./pages/404";
import Alert from 'react-s-alert';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler'
import {getCurrentUser} from "./api/Utils"
import {ACCESS_TOKEN, USER_AUTHORIZED} from "./constants";

class App extends Component {
    constructor(props) {
        super(props);

        this.changeState = (state) => {
            if (state) {
                this.getUser();
            } else {
                this.setState({
                    authorized: false,
                    user: {}
                })
            }
        }

        this.state = {
            authorized: false,
            loading: true,
            user: {},
            changeState: this.changeState,
        }
    }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        getCurrentUser()
            .then(response => {
                this.setState({
                    user: response,
                    authorized: true,
                    loading: false
                });
            }).catch(error => {
            this.setState({
                loading: false,
                authorized: false,
                user: {}
            });
        });
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);
        this.setState({
            authorized: false,
            user: {}
        });
        Alert.success("Вы вышли из аккаунта");
    }

    render() {
        if (this.state.loading) {
            return <div>Авторизация...</div>
        }

        return (
            <USER_AUTHORIZED.Provider value={this.state}>
                <BrowserRouter>
                    <Alert stack={{limit: 4}} effect={'slide'}/>
                    <Switch>
                        <Route path={'/'} component={Main} exact={true}/>
                        <Route path={'/game'} component={(props) => <Game {...props}/>}/>
                        <Route path={'/rating'}
                               component={(props) => <Rating {...props}/>}/>
                        <Route path={"/oauth2/redirect"} component={OAuth2RedirectHandler}/>
                        <Route path={"/logout"} component={() => {
                            this.handleLogout();
                            return <Redirect to={'/game'}/>
                        }}/>
                        <Route path={'/'} component={PageNotFound}/>
                    </Switch>
                </BrowserRouter>
            </USER_AUTHORIZED.Provider>
        );
    }
}

export default App;
