import React from 'react';
import {Button, Container, Image, Nav, Navbar, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from "../images/logo-main.png";
import '../HeaderAnimate.css';
import Auth from './Auth';
import {USER_AUTHORIZED} from "../constants";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headerBlock: !!props.animate,
            headerBlockAnimate: false,
        }
    }

    headerRollUp = () => {
        this.setState({
            headerBlockAnimate: true
        })

        setTimeout(() => {
            this.setState({
                headerBlock: false,
                headerBlockAnimate: false
            });
            this.props.history.push('/game');
        }, 1800)
    }

    render() {
        return <header className={
            (this.state.headerBlock ? 'header-block ' : '') +
            (this.state.headerBlockAnimate ? 'header-animate ' : '') +
            'header '
        }>
            <Navbar>
                <Container className={'header__wrap'}>
                    {<Navbar.Brand as={Link} to={'/'} className={'header_logo'}>
                        <Image src={logo} alt="cows&bulls"/>
                    </Navbar.Brand>}
                    {<Row className={'header_menu__wrap flex-column'}>
                        <div className={'header_menu-up'}>
                            <h2 className={'header_title'}>Игра "Быки и коровы"</h2>
                            <Button className={'px-5 header_menu-up_gameButton'} onClick={this.headerRollUp}
                                    variant={"outline-primary"}>Игра</Button>
                        </div>
                        <Nav className={'justify-content-center header_menu'}>
                            <Nav.Link as={Link} to={'/game'}>
                                Игра
                            </Nav.Link>
                            <Nav.Link as={Link} to={'/rating'}>
                                Рейтинг
                            </Nav.Link>
                            {!this.context.authorized && <Nav.Link>
                                 <Auth {...this.props}/>
                            </Nav.Link>}
                            {this.context.authorized && <Nav.Link>
                                {this.context.user.name}
                            </Nav.Link>}
                            {this.context.authorized && <Nav.Link as={Link} to={'/logout'}>
                                Выйти
                            </Nav.Link>}
                        </Nav>
                    </Row>}
                </Container>
            </Navbar>
        </header>
    }
}

Header.contextType = USER_AUTHORIZED;

export default Header;
