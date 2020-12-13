import React, {Component} from "react";
import {Button, Col, Container, FormControl, Form, Row, OverlayTrigger, Tooltip} from "react-bootstrap";

import {Animated} from 'react-animated-css'

const LENGTH_NUMBER = 4;

/**
 * number - значение вводимое пользоваетелем
 * guess - загаданное значение
 * clearHistory - флаг очистки истории
 * history - история ввода значения
 * countInsertNumber - количество попыток ввода цифры
 * countInsertNumberAllow - количество попыток ввода цифры до показа подсказки
 * lengthNumber - длина загадываемого значения
 * indexLastNumber - индекс последнего вводимой цифры
 * showFilter - отображать ли попап фильтра
 * filter - параметры для настройки игры
 * gameEnd - флаг окончания игры (победа)
 */
class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: new Array(LENGTH_NUMBER).fill(''),
            guess: this.getRandomNumber(),
            history: [],
            clearHistory: true,
            countInsertNumber: 0,
            countInsertNumberAllow: 4,
            lengthNumber: LENGTH_NUMBER,
            indexLastNumber: 0,
            showFilter: false,
            filter: {
                showNumber: false,
            },
            gameEnd: false,
        };
        this.inputRefs = new Array(LENGTH_NUMBER);
    }

    /**
     * ограничение ввода символов кроме цифр и ограничение на повторяющиеся
     *
     * @param i "Индекс input"
     */
    onChangeNumber = (i) => {
        let digit = parseInt(this.inputRefs[i].value);
        if ((/^[\d\b]$/u.test(digit) && this.state.number.indexOf(digit) === -1)) {
            let number = this.state.number;
            number[i] = digit;
            this.setState({
                number: number,
                countInsertNumber: 0,
            });

            if (i + 1 < this.state.lengthNumber) {
                this.inputRefs[i + 1].focus();
            }
        } else {
            this.setState({
                countInsertNumber: this.state.countInsertNumber + 1,
                indexLastNumber: i,
            })
        }
    }

    /**
     * очистка input
     * @param event
     * @param i
     */
    onKeyDownNumber = (event, i) => {
        //backspace || del
        if (event.keyCode === 8 || event.keyCode === 46) {
            let number = this.state.number;
            number[i] = '';
            this.setState({
                number: number,
                countInsertNumber: 0,
            });
        }
    }

    /**
     * запуск логики проверки введненного значения
     */
    onClickCheck = () => {
        if (this.state.number.join('').length < this.state.lengthNumber) {
            let index = this.state.number.indexOf('');
            console.log(index)
            this.inputRefs[index].focus();
            return;
        }

        let history = this.state.history;
        let checkResult = this.compareNumbers();
        history.unshift(`${this.state.number.join('')} - быков: ${checkResult.bulls}; коров: ${checkResult.cows};`);
        this.setState({
            history: history
        })
    }

    /**
     * Сравнение значений пользователя и загаднного
     *
     * @returns {{cows: number, bulls: number}}
     */
    compareNumbers = () => {
        let result = {bulls: 0, cows: 0};
        this.state.number.map((o, i) => {
            if (this.state.guess.indexOf(o) !== -1) {
                if (this.state.guess[i] === o) {
                    result.bulls++;
                } else {
                    result.cows++;
                }
            }
        });
        if (result.bulls === this.state.lengthNumber) {
            this.setState({
                endGame: true,
            });
        }
        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.guess !== this.state.guess) {
            this.setState({
                history: []
            })
        }
    }

    /**
     * перезапуск игры
     */
    gameStart = () => {
        this.setState({
            guess: this.generateRandomNumber(),
            endGame: false,
            number: new Array(this.state.lengthNumber).fill('')
        })
    }

    /**
     * генирация рандомного значения без повторения цифр длинной до 10
     *
     * @returns {any[]}
     */
    generateRandomNumber = () => {
        let lengthNumber = this.state != null ? this.state.lengthNumber : LENGTH_NUMBER;
        let alphabet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let result = new Array(lengthNumber);
        let index = 0;
        while (result.join('').length < lengthNumber) {
            let digit = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (result.indexOf(digit) === -1) {
                result[index++] = digit;
                alphabet.splice(index, 1);
            }
        }
        return result;
    }

    /**
     * Проверяет загаданное число в истории, если такого нет, то возвращает новое рандомное
     *
     * @returns {any[]}
     */
    getRandomNumber = () => {
        /*if (typeof historyNumber !== 'undefined') {
            return historyNumber;
        }*/

        return this.generateRandomNumber();
    }

    render() {
        return <Col md={8} lg={4} className={'bcg game'}>
            <Row>
                <Col xs={12} md={6} xl={6}>
                    <Button block variant={"outline-primary"} onClick={this.gameStart}>Новая игра</Button>
                </Col>
                <Col xs={12} md={6} xl={6}>
                    <Button block variant={"info"} onClick={() => {
                        this.setState({showFilter: !this.state.showFilter})
                    }}>Фильтр</Button>
                    {this.state.showFilter && <div className={'filter-block'}>
                        <Form>
                            <Form.Group controlId="showNumberCheck">
                                <Form.Check type="checkbox" label="Отобразить загаданное число"
                                            checked={this.state.filter.showNumber} onChange={(e) => {
                                    this.setState({
                                        filter: {
                                            ...this.state.filter,
                                            showNumber: e.target.checked
                                        }
                                    })
                                }}/>
                            </Form.Group>
                        </Form>
                    </div>}
                </Col>
            </Row>
            <Row>
                {!this.state.endGame && <Container className={'mt-5 p-0'}>
                    {this.state.filter.showNumber && <Row className={'justify-content-center mb-2'}>
                        <Col className={'text-center'}><span>{this.state.guess.join('')}</span></Col>
                    </Row>}
                    <Row className={'justify-content-center'}>
                        <Col lg={12}>
                            <Col>
                                <Row className={'justify-content-center'}>
                                    {(new Array(this.state.lengthNumber)).fill(1).map((o, i) => {
                                        let input = <FormControl ref={(ref) => {
                                            this.inputRefs[i] = ref
                                        }}
                                                                 onChange={() => this.onChangeNumber(i)}
                                                                 onKeyDown={(event) => this.onKeyDownNumber(event, i)}
                                                                 value={`${this.state.number[i]}` || ''} size={1}
                                                                 className={'text-center p-0'}/>;
                                        if (this.state.countInsertNumber > this.state.countInsertNumberAllow && this.state.indexLastNumber === i) {
                                            input = <OverlayTrigger
                                                placement={'bottom'}
                                                show={true}
                                                overlay={
                                                    <Tooltip className={'game-tooltip'}>
                                                        Нельзя указать несколько одинаковых цифр
                                                    </Tooltip>
                                                }
                                            >
                                                {input}
                                            </OverlayTrigger>
                                            setTimeout(() => {
                                                this.setState({countInsertNumber: 0})
                                            }, 2000)
                                        }
                                        return <Col className={'flex-grow-0'} key={i}>{input}</Col>
                                    })}
                                </Row>
                            </Col>
                            <Col className={'btn_motion mt-2'}>
                                <Button block onClick={this.onClickCheck}>Сделать ход</Button>
                            </Col>
                            <Col className={'history mt-2'}>
                                <Animated animationOut={'flipInY'} animationOutDuration={700}
                                          isVisible={!!this.state.history.length} animationIn={'visible'}>
                                    <Form.Control value={this.state.history.join('\n')} readOnly={true}
                                                  as={'textarea'}
                                                  rows={4} className={'no-shadow'}/>
                                </Animated>
                            </Col>
                        </Col>
                    </Row>
                </Container>}
                {this.state.endGame && <Container className={'mt-5 p-0'}>
                    <Animated animationOut={'flipInY'} animationOutDuration={700}
                              isVisible={!this.state.endGame} animationIn={'visible'}>
                        <Row className={'justify-content-center'}>
                            <Col className={'text-center'}>
                                <h2>Вы выйграли!</h2>
                                <h4>Загаданное число - {this.state.guess.join('')}</h4>
                            </Col>
                        </Row>
                    </Animated>
                </Container>}
            </Row>
        </Col>;
    }
}

export default Game;