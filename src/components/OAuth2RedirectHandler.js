import React, {Component} from 'react';
import {ACCESS_TOKEN} from '../constants';
import {Redirect} from 'react-router-dom';
import {getUrlParameter} from '../api/Utils'

class OAuth2RedirectHandler extends Component {
    render() {
        const token = getUrlParameter('token', this.props);
        const error = getUrlParameter('error', this.props);

        if (token) {
            localStorage.setItem(ACCESS_TOKEN, token);
            return <Redirect to={{
                pathname: "/game",
            }}/>;
        } else {
            return <Redirect to={{
                pathname: "/game",
                state: {
                    error: error
                }
            }}/>;
        }
    }
}

export default OAuth2RedirectHandler;