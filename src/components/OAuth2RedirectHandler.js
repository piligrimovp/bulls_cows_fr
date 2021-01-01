import React, {Component} from 'react';
import {ACCESS_TOKEN, AUTH_MODAL_NAME} from '../constants';
import {getUrlParameter} from '../api/Utils'

class OAuth2RedirectHandler extends Component {
    render() {
        const token = getUrlParameter('token', this.props);
        const error = getUrlParameter('error', this.props);

        if (token) {
            localStorage.setItem(ACCESS_TOKEN, token);
        }

        if (window.name === AUTH_MODAL_NAME) {
            window.opener.dispatchEvent(new CustomEvent(AUTH_MODAL_NAME + 'closed', {detail: {'message': error}}))
        }

        return null;
    }
}

export default OAuth2RedirectHandler;