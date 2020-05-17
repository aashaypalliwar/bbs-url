import React, { Component } from 'react';

import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import axios from 'axios';
import { headingStyle, textStyle, theadStyle, categoryStyle, descriptionStyle, bodyTextStyle } from "./LandingStyles";
import {Link} from "react-router-dom";
import CategoryCreator from "../../components/CategoryCreator";
import CategoryRow from "../../components/CategoryRow";

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            _id: null,
            email: null,
            name: null,
            role: 'user',
            suborg: [],
            categories: [],
            numberOfURLs: null,
            URLInfo : null
        }
    }

    static getDerivedStateFromProps(props, state){
        let newState = {
            authenticated: props.appState.authenticated,
            _id: props.appState._id,
            email: props.appState.email,
            name: props.appState.name,
            role: props.appState.role,
            suborg: props.appState.suborg,
            categories: props.appState.categories,
            numberOfURLs: props.appState.numberOfURLs,
            URLInfo : props.appState.URLInfo
        }
        return newState;
    }

    render () {
        return (
            <Container>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                        Hi {this.state.name}, Welcome to your Dashboard!
                    </Col>
                </Row>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                        Manage your URL categories
                    </Col>
                </Row>
                <Row>
                    <Col md={ {span: 8, offset: 2}} lg={ {span: 8, offset: 2}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                        <Table responsive bordered>
                            <thead style={theadStyle}>
                            <tr>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={categoryStyle}>Root</td>
                                    <td style={descriptionStyle}>All uncategorized short and custom URLs</td>
                                    <td style={descriptionStyle}> </td>
                                </tr>
                                {this.props.appState.categories.map( (category, index) => {
                                    return (
                                        <CategoryRow key={category.name} category={category} set={this.props.set} categories={this.props.appState.categories}/>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <CategoryCreator set={this.props.set} landingPageState={this.props.appState}/>
                <Row>
                    <Col md={ {span: 8, offset: 2}} lg={ {span: 8, offset: 2}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={bodyTextStyle}>
                        <span style={{"fontSize": "1.3rem", "color": "#093009"}}>How to use?</span>
                        <p>
                            This URL managing tool provides you with custom URLs or randomly generated short URLs that can be mapped to any website you wish. You can also categorize your URLs into sub-groups for easier access and identification.<br/><br/>
                            <span style={{"fontSize": "1.3rem", "color": "#093009"}}>The Root Category</span>
                            <br/>The Root category is where you can manage all short and custom URLs which are not categorized<br/>
                            eg. <a style={{"color":"green"}}>bbsurl.in/Qwdt8P</a> or <a  style={{"color":"green"}}>bbsurl.in/matchSchedule</a><br/><br/>
                            <span style={{"fontSize": "1.3rem", "color": "#093009"}}>Other Categories</span><br/>
                            Under the category "endsem" one may create:<br/>1. A random URL like <a style={{"color":"green"}}>bbsurl.in/endsem/Asd2It</a> that points to your google-drive notes folder and share this with your pals.<br/>
                            2. Or, may be you can map the link to your favourite youtube tutorial to <a  style={{"color":"green"}}>bbsurl.in/endsem/graphs</a>. You can delete a given category in one go as well.<br/><br/>
                            Your imagination is the limit! You have stumbled upon the one solution to long URLs and cluttered bookmark tools.
                        </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}


export default LandingPage;
