import React, { Component } from 'react';
import { withRouter } from "react-router";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import axios from 'axios';
import { headingStyle, textStyle, theadStyle, categoryStyle, descriptionStyle, bodyTextStyle, breadStyle, linkStyle, HeadLinkStyle } from "./RootStyles";
import {Link} from "react-router-dom";
import RootCreator from "../../components/RootCreator";
import RootRow from "../../components/RootRow";
import CategoryRow from "../../components/CategoryRow";
import Breadcrumb from "react-bootstrap/Breadcrumb";


class RootManager extends Component {
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


    componentDidMount() {
        axios.get('/api/user/url', { withCredentials: true})
            .then((response) => {
                if(response.status === 200){
                    this.setState({URLInfo: response.data.URLData, loadState: "loaded"})
                }
            })
            .catch((error) => {
                console.log("Couldnot fetch data")
            })
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

    urlTable = () => (
        <Row>
            <Col md={ {span: 10, offset: 1}} lg={ {span: 8, offset: 2}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                <Table responsive bordered style={{"marginTop": "1rem"}}>
                    <thead style={theadStyle}>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Original URL</th>
                        <th>BBS-URL</th>
                        <th>Hits</th>
                        <th>Created on</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.URLInfo.map( (url, index) => {
                        return (
                            <RootRow key={url.shortURLEndPoint} url={url} set={this.indirectSetState} index={index} urls={this.state.URLInfo}/>
                        );
                    })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );

    emptyPage = () => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                {"You do not have any short/custom URL yet. Make one now !"}
            </Col>
        </Row>
    );


    render () {
        return (
            <Container>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                        <span onClick={this.goBack} style={HeadLinkStyle} >Dashboard</span> / Root URL manager
                    </Col>
                </Row>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                        Create a custom or random URL that maps to any website!
                    </Col>
                </Row>
                <RootCreator set={this.indirectSetState} urls={this.state.URLInfo}/>
                {
                    this.state.loadState === "loading" ? this.loading : null
                }
                {
                    (JSON.stringify(this.state.URLInfo) === JSON.stringify([]) && this.state.loadState === "loaded")?
                        this.emptyPage()
                        : this.urlTable()
                }
                <Row>
                    <Col md={ {span: 8, offset: 2}} lg={ {span: 8, offset: 2}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={bodyTextStyle}>
                        <span style={{"fontSize": "1.3rem", "color": "#093009"}}>How to use?</span>
                        <p>
                            This URL managing tool provides you with custom URLs or randomly generated short URLs that can be mapped to any website you wish. You can also categorize your URLs into sub-groups for easier access and identification.<br/><br/>
                            <span style={{"fontSize": "1.3rem", "color": "#093009"}}>The Root Category</span>
                            <br/>The Root category is where you can manage all short and custom URLs which are not categorized<br/>
                            eg. <a style={{"color":"green"}}>bbsurl.in/Qwdt8P</a> or <a  style={{"color":"green"}}>bbsurl.in/matchSchedule</a><br/><br/>
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

export default withRouter(RootManager);