import React from "react";
import {Container, Image} from "react-bootstrap";
import {Link} from 'react-router-dom'
import ImageBullsCows from '../images/bulls_and_cows.png';

export default class PageNotFound extends React.Component {
    render() {
        return (
            <section>
                <Container className={'all-center'}>
                    <h1 className={'text-center'}>Вы потерялись!</h1>
                    <Image src={ImageBullsCows}/>
                    <h3 className={'text-center'}>
                        <Link className={'text-dark'} to={'/'}>Вернуться на главную</Link>
                    </h3>
                </Container>
            </section>
        );
    }
}