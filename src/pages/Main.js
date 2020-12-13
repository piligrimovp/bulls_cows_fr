import React from "react";
import Header from "../components/Header";

export default class Main extends React.Component {
    render() {
        return <Header {...this.props} animate={true}/>
    }
}