import React, { Component } from 'react';
import { withRouter } from "react-router";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import axios from 'axios';
import { headingStyle, textStyle, theadStyle, categoryStyle, descriptionStyle, bodyTextStyle, breadStyle, linkStyle, HeadLinkStyle } from "./GuestStyles";
import {Link} from "react-router-dom";
import RootCreator from "../../components/RootCreator";
import RootRow from "../../components/RootRow";
import CategoryRow from "../../components/CategoryRow";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import GuestURLCreator from "../../components/GuestURLCreator";


class Guest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: null,
            email: null,
            name: null,
            numberOfURLs: null,
            URLInfo : [],
            loadState: "loading"
        }
    }


    indirectSetState = (newState) => {
        this.setState(newState);
    }

    displayState = () => console.log(" ");

    loading = () => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                <span onClick={this.displayState}>"Loading.."</span>
            </Col>
        </Row>
    );

    goBack = () => {
        this.props.history.replace('/');
    }


    render () {
        return (
            <Container>
                <Row>
                    <Col md={ {span: 6, offset: 3}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                        Not the conventional URL Shortener
                    </Col>
                </Row>
                <Row>
                    <Col md={ {span: 6, offset: 3}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                        Create a custom or a random short URL that maps to any website! Sign Up to create special categories and manage all your URLs at one place!
                    </Col>
                </Row>
                <GuestURLCreator/>
                <Row>
                    <Col md={ {span: 8, offset: 2}} lg={ {span: 8, offset: 2}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={bodyTextStyle}>
                        <span style={{"fontSize": "1.3rem", "color": "#093009"}}>How to use?</span>
                        <p>
                            This URL managing tool provides you with custom URLs or randomly generated short URLs that can be mapped to any website you wish. Once you have signed up, you can also categorize your URLs into sub-groups for easier access and identification. All services are completely free.<br/><br/>
                            <span style={{"fontSize": "1.3rem", "color": "#093009"}}>The Root Category</span>
                            <br/>All users get access to the root category where they can manage all short and custom URLs which are not categorized<br/>
                            eg. <a style={{"color":"green"}}>bbsurl.in/Qwdt8P</a> or <a  style={{"color":"green"}}>bbsurl.in/matchSchedule</a><br/><br/>
                            <span style={{"fontSize": "1.3rem", "color": "#093009"}}>Other Categories</span><br/>
                            Signed In users can also create categories. eg. under the category "endsem" one may create:<br/>1. A random URL like <a style={{"color":"green"}}>bbsurl.in/endsem/Asd2It</a> that points to your google-drive notes folder and share this with your pals.<br/>
                            2. Or, may be you can map the link to your favourite youtube tutorial to <a  style={{"color":"green"}}>bbsurl.in/endsem/graphs</a>. You can delete any given category in one go as well.<br/><br/>
                            Your imagination is the limit! You have stumbled upon the one solution to long URLs and cluttered bookmark tools.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col md={ {span: 6, offset: 3}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={{fontSize:"0.85rem",
                        paddingBottom: "0",
                        paddingLeft: "0",
                        paddingRight: "0",
                        textAlign:"center",
                        marginTop:"1rem",
                        marginBottom:"1rem"}}>
                        Brought to you by <a style={{"color": "green"}} target="_blank" href="https://aashaypalliwar.github.io">Aashay Palliwar</a>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(Guest);