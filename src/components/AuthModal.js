import React from "react";
import {AUTH_MODAL_NAME} from "../constants";
import Alert from 'react-s-alert'

class AuthModal extends React.Component {
    constructor(props) {
        super(props);

        this.el = document.createElement('div');
        this.externalWindow = null;
        this.timer = null;
    }

    componentDidMount() {
        if (this.props.link == null) {
            Alert.warning('Не удалось определить ссылку авторизации((');
            this.props.onClose();
            return;
        }

        this.externalWindow = window.open(this.props.link, AUTH_MODAL_NAME, 'width=600,height=400,alignment=CENTER');

        if (this.externalWindow == null) {
            Alert.warning('Не удалось открыть окно авторизации, возможно ваш браузер блокирует открытие всплывающих окон.');
            this.props.onClose();
            return;
        }

        if (this.timer === null) {
            this.timer = setInterval(this.watcher, 2000);
        }

        let handler = this.props.onClose;

        window.self.addEventListener(AUTH_MODAL_NAME + 'closed', function (e) {
            let error = null;
            if (e.detail != null) {
                error = e.detail.message;
            }
            handler(error)
        });

        this.externalWindow.document.body.appendChild(this.el);
    }

    watcher = () => {
        if (this.externalWindow === null) {
            clearInterval(this.timer);
            this.timer = null;
        } else if (this.externalWindow !== null && !this.externalWindow.closed) {
            this.externalWindow.focus();
        } else if (this.externalWindow !== null && this.externalWindow.closed) {
            clearInterval(this.timer);
            window.self.focus();

            this.timer = null;
            if (this.externalWindow != null) {
                this.props.onClose();
            }
        }
    }

    componentWillUnmount() {
        if (this.externalWindow == null) {
            return;
        }
        clearInterval(this.timer);
        this.externalWindow.close();
        this.externalWindow = null;
        window.self.removeEventListener(AUTH_MODAL_NAME + 'closed', this.props.onClose);
    }

    render() {
        return null;
    }
}

export default AuthModal;