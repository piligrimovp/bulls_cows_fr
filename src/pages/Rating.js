import React from "react";
import Header from "../components/Header";
import {Col, Container, Form, Row, Table} from "react-bootstrap";
import {getRatingAll, getRatingUser} from "../api/Utils";

export default class Rating extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            records: [],
            mode: 'user',
        }
    }

    changeMode = (value) => {
        let mode = value.target.checked ? 'user' : 'all';
        this.setState({
            mode: mode
        }).then(() => {
            this.updateRecords();
        })
    }

    componentDidMount() {
        this.updateRecords();
    }

    updateRecords = () => {
        if (this.state.mode === 'user') {
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
        if (this.state.mode === 'all') {
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
                <Header authorized={this.props.authorized} user={this.props.user}/>
                <main>
                    <Container>
                        {!this.props.authorized && <h2 className={'text-center'}>Вы не авторизованы</h2>}
                        {this.props.authorized && <Row>
                            <Col>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Вывести полный рейтинг/только мой"
                                    onChange={(e) => this.changeMode(e)}
                                />
                            </Col>
                        </Row>}
                        {this.props.authorized && <Table>
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
                                        <td>{e.user.id}</td>
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