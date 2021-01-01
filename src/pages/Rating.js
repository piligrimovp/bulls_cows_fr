import React from "react";
import Header from "../components/Header";
import {Col, Container, Form, Row, Table} from "react-bootstrap";
import {getRatingAll, getRatingUser} from "../api/Utils";
import {USER_AUTHORIZED} from "../constants";

class Rating extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            records: [],
            mode: 'user',
        }
    }

    changeMode = (e) => {
        let mode = e.target.checked ? 'user' : 'all';
        this.setState({
            mode: mode
        })
        this.updateRecords(mode);
    }

    componentDidMount() {
        this.updateRecords();
    }

    updateRecords = (mode = this.state.mode) => {
        if (!this.context.authorized) {
            return;
        }

        if (mode === 'user') {
            this.setState({
                loading: true
            })
            getRatingUser().then(response => {
                this.setState({
                    loading: false,
                    records: response || []
                });
            }).catch(error => {
                this.setState({
                    loading: false
                })
            })
        }
        if (mode === 'all') {
            this.setState({
                loading: true
            })
            getRatingAll().then(response => {
                this.setState({
                    loading: false,
                    records: response || []
                });
            }).catch(error => {
                this.setState({
                    loading: false
                })
            });
        }
    }

    render() {
        return (
            <section>
                <Header/>
                <main>
                    <Container>
                        {!this.context.authorized && <h2 className={'text-center'}>Вы не авторизованы</h2>}
                        {this.context.authorized && <Row>
                            <Col>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Вывести полный рейтинг/только мой"
                                    checked={this.state.mode === 'user'}
                                    onChange={(e) => this.changeMode(e)}
                                />
                            </Col>
                        </Row>}
                        {this.context.authorized && <Table>
                            <thead>
                            <tr>
                                <td>№</td>
                                <td>Пользователь</td>
                                <td>Загаданное число</td>
                                <td>Количество попыток</td>
                                <td>Дата</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.loading && <tr>
                                    <td colSpan={5} className={'text-center'}>загрузка...</td>
                                </tr>
                            }
                            {
                                !this.state.loading && this.state.records.map((e, i) => {
                                    return <tr key={i}>
                                        <td>{1 + i}</td>
                                        <td>{e.user.name}</td>
                                        <td>{e.number}</td>
                                        <td>{e.attempts}</td>
                                        <td>{e.created_at}</td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </Table>}
                    </Container>
                </main>
            </section>
        );
    }
}

Rating.contextType = USER_AUTHORIZED;

export default Rating;