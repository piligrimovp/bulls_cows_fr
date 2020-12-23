import React from "react";
import {Modal, Button, Tab, ButtonGroup, Image, Form, Nav, Row, Col} from 'react-bootstrap';
import googleImage from '../images/auth/google-logo.png';
import '../AuthModal.css';
import './Validators';
import {validateEmail, validatePassword, validatePasswordConfirm, validateName} from "./Validators";
import {ACCESS_TOKEN, GOOGLE_AUTH_URL} from '../constants';
import {login, signup, getUrlParameter} from "../api/Utils";
import Alert from 'react-s-alert';

export default class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            errorsValidating: {
                'login': {},
                'signup': {}
            },
            data: {
                'login': {
                    email: '',
                    password: ''
                },
                'signup': {
                    email: '',
                    name: '',
                    password: '',
                    passwordConfirm: '',
                }
            }
        };
    }

    getErrorInputClass = (tab, input) => {
        if (!this.state.errorsValidating.hasOwnProperty(tab)) {
            return '';
        }

        let result = '';
        let inputHasError = this.state.errorsValidating[tab].hasOwnProperty(input);

        if (inputHasError) {
            result = 'border-danger';
        }

        return result;
    }

    getErrorTipClass = (tab, input) => {
        if (!this.state.errorsValidating.hasOwnProperty(tab)) {
            return '';
        }

        let result = '';
        let inputHasError = this.state.errorsValidating[tab].hasOwnProperty(input);

        if (inputHasError) {
            result = 'text-danger';
        }

        return result;
    }

    getErrorTipText = (tab, input) => {
        if (!this.state.errorsValidating.hasOwnProperty(tab)) {
            return '';
        }

        let result = '';
        let inputHasError = this.state.errorsValidating[tab].hasOwnProperty(input);

        if (inputHasError) {
            result = this.state.errorsValidating[tab][input];
        }

        return result;
    }

    validateInput = (tab, input, value, setState = true) => {
        let errorText = '';
        let hasError = false;
        switch (input) {
            case 'email':
                [hasError, errorText] = validateEmail(value);
                break;
            case 'password':
                [hasError, errorText] = validatePassword(value);
                break;
            case 'passwordConfirm':
                [hasError, errorText] = validatePasswordConfirm(value, this.state.data[tab]['password']);
                break;
            case 'name':
                [hasError, errorText] = validateName(value);
                break;
            default:
                break;
        }
        hasError = !hasError;

        let errorsValidating = this.state.errorsValidating;
        if (hasError) {
            errorsValidating = {
                ...this.state.errorsValidating,
                [tab]: {
                    ...this.state.errorsValidating[tab],
                    [input]: errorText
                }
            }
        } else {
            delete errorsValidating[tab][input];
        }

        if (setState) {
            this.setState({
                errorsValidating: errorsValidating,
                data: {
                    [tab]: {
                        ...this.state.data[tab],
                        [input]: value
                    }
                }
            })
        } else {
            return errorsValidating[tab];
        }
    }

    handleSubmitLogin = () => {
        let data = this.state.data.login;
        let errorsValidating = this.state.errorsValidating.login;
        for (let key in data) {
            if (key === 'password') {
                continue;
            }
            errorsValidating = {...errorsValidating, ...this.validateInput('login', key, data[key], false)};
        }
        if (Object.entries(errorsValidating).length <= 0) {
            login(data)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    Alert.success("Вы авторизованы!");
                    this.setState({
                        showModal: false
                    })
                }).catch(error => {
                Alert.error((error && error.message) || 'Ошибка аторизации. Попробуйте еще раз позже.');
            });
        } else {
            this.setState({
                errorsValidating: {
                    ...this.state.errorsValidating,
                    'login': errorsValidating
                }
            })
        }
    }

    handleSubmitSignUp = () => {
        let data = this.state.data.signup;
        let errorsValidating = this.state.errorsValidating.signup;
        for (let key in data) {
            errorsValidating = {...errorsValidating, ...this.validateInput('signup', key, data[key], false)};
        }

        if (Object.entries(errorsValidating).length <= 0) {
            signup(data)
                .then(response => {
                    Alert.success("Вы зарегистрированы! Пожалуйста, авторзуйтесь.");
                }).catch(error => {
                Alert.error((error && error.message) || 'Ошибка регистрации. Попробуйте еще раз позже.');
            });
        } else {
            this.setState({
                errorsValidating: {
                    ...this.state.errorsValidating,
                    'signup': errorsValidating
                }
            })
        }
    }

    render() {
        return <div>
            <span onClick={() => this.setState({showModal: true})}>Войти</span>
            <Modal
                show={this.state.showModal}
                onHide={() => {
                    this.setState({showModal: false})
                }}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className={'authModal'}
            >
                <Tab.Container id="authModal" defaultActiveKey="login">
                    <Modal.Header closeButton>
                        <Nav variant="tabs" className="flex-row">
                            <Nav.Item>
                                <Nav.Link eventKey="login" className={'px-2'}>Войти</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="signup" className={'px-2'}>Зарегистрироваться</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Modal.Header>
                    <Modal.Body>
                        <Tab.Content>
                            <Tab.Pane eventKey="login">
                                <ButtonGroup vertical={true} className={'w-75 pr-5'}>
                                    <Button variant={'social'} onClick={() => {
                                        window.open(GOOGLE_AUTH_URL, '_blank')
                                    }}>
                                        <Image src={googleImage} className={'btn-social_logo'}/>
                                        Войти с помощью Google
                                    </Button>
                                </ButtonGroup>
                                <div className="or-separator">
                                    <span className="or-text">ИЛИ</span>
                                </div>
                                <Form>
                                    <Form.Text
                                        className={'text-danger mb-3'}>{this.state.errorsValidating.login.global}</Form.Text>
                                    <Form.Group controlId="loginEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Email"
                                                      className={this.getErrorInputClass('login', 'email')}
                                                      onChange={(e) => this.validateInput('login', 'email', e.target.value)}/>
                                        <Form.Text
                                            className={this.getErrorTipClass('login', 'email')}>{this.getErrorTipText('login', 'email')}</Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="loginPassword">
                                        <Form.Label>Пароль</Form.Label>
                                        <Form.Control type="password" placeholder="Пароль"
                                                      className={this.getErrorTipClass('login', 'password')}/>
                                        <Form.Text
                                            className={this.getErrorTipClass('login', 'password')}>{this.getErrorTipText('login', 'password')}</Form.Text>
                                    </Form.Group>
                                    <Button variant="primary" type="button" onClick={this.handleSubmitLogin}>
                                        Войти
                                    </Button>
                                </Form>
                            </Tab.Pane>
                            <Tab.Pane eventKey="signup">
                                <Form>
                                    <Form.Text className="text-muted mb-3">
                                        *Все поля являются обязательными для заполенения
                                    </Form.Text>
                                    <Form.Text
                                        className={'text-danger mb-3'}>{this.state.errorsValidating.login.global}</Form.Text>
                                    <Form.Group controlId="signUpEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Email"
                                                      className={this.getErrorInputClass('signup', 'email')}
                                                      onChange={(e) => this.validateInput('signup', 'email', e.target.value)}/>
                                        <Form.Text
                                            className={this.getErrorTipClass('signup', 'email')}>{this.getErrorTipText('signup', 'email')}</Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="signUpName">
                                        <Form.Label>Имя</Form.Label>
                                        <Form.Control type="text" placeholder="Имя"
                                                      className={this.getErrorInputClass('signup', 'name')}
                                                      onChange={(e) => this.validateInput('signup', 'name', e.target.value)}/>
                                        <Form.Text
                                            className={this.getErrorTipClass('signup', 'name')}>{this.getErrorTipText('signup', 'name')}</Form.Text>
                                    </Form.Group>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="signUpPassword">
                                                <Form.Label>Пароль</Form.Label>
                                                <Form.Control type="password" placeholder="Пароль"
                                                              className={this.getErrorInputClass('signup', 'password')}
                                                              onChange={(e) => this.validateInput('signup', 'password', e.target.value)}/>
                                                <Form.Text
                                                    className={this.getErrorTipClass('signup', 'password')}>{this.getErrorTipText('signup', 'password')}</Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="signUpPasswordConfirm">
                                                <Form.Label>Подтверждение пароля</Form.Label>
                                                <Form.Control type="password" placeholder="Подтверждение пароля"
                                                              className={this.getErrorInputClass('signup', 'passwordConfirm')}
                                                              onChange={(e) => this.validateInput('signup', 'passwordConfirm', e.target.value)}/>
                                                <Form.Text
                                                    className={this.getErrorTipClass('signup', 'passwordConfirm')}>{this.getErrorTipText('signup', 'passwordConfirm')}</Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" type="button" onClick={this.handleSubmitSignUp}>
                                        Зарегистрироваться
                                    </Button>
                                </Form>
                            </Tab.Pane>
                        </Tab.Content>
                    </Modal.Body>
                </Tab.Container>
            </Modal>
        </div>
    }
}