import React, { Component } from 'react';
import { withRouter } from "react-router";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import axios from 'axios';
import { headingStyle, textStyle, theadStyle, categoryStyle, descriptionStyle, bodyTextStyle, breadStyle, linkStyle, HeadLinkStyle } from "./AdminStyles";
import {Link} from "react-router-dom";
import RootCreator from "../../components/RootCreator";
import RootRow from "../../components/RootRow";
import CategoryRow from "../../components/CategoryRow";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import CategoryURLCreator from "../../components/CategoryURLCreator";
import CategoryURLRow from "../../components/CategoryURLRow";
import AdminURLRow from "../../components/AdminURLRow";
import AdminUserRow from "../../components/AdminUserRow";
import AdminSuborgRow from "../../components/AdminSuborgRow";


class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: [],
            suborgInfo: [],
            URLInfo: [],
            userLoad: "loading",
            suborgLoad: "loading",
            URLLoad: "loading"
        }
        console.log("categurlconstructor worked");
        console.log("printing state", this.state);
    }


    componentDidMount() {
        console.log("inside cdm");
        console.log("printing state", this.state);
        axios.get('/api/admin/users', { withCredentials: true})
            .then((response) => {
                if(response.status === 200){
                    console.log(response);
                    console.log("fetched user info")
                    this.setState({userInfo: response.data.allUsers, userLoad: "loaded"})
                }
            })
            .catch((error) => {
                console.log(error);
                console.log("Couldnot fetch user data")
            })
        axios.get('/api/admin/suborgs', { withCredentials: true})
            .then((response) => {
                if(response.status === 200){
                    console.log(response);
                    console.log("fetched  suborgs info")
                    this.setState({suborgInfo: response.data.allSuborgs, suborgLoad: "loaded"})
                }
            })
            .catch((error) => {
                console.log(error);
                //throw error
                console.log("Couldnot fetch suborg data")
            })
        axios.get('/api/admin/urls', { withCredentials: true})
            .then((response) => {
                if(response.status === 200){
                    console.log(response);
                    console.log("fetched  url info")
                    this.setState({URLInfo: response.data.allURLs, URLLoad: "loaded"})
                }
            })
            .catch((error) => {
                console.log(error);
                //throw error
                console.log("Couldnot fetch url data")
            })
    }

    indirectSetState = (newState) => {
        this.setState(newState);
    }

    displayState = () => console.log(this.state);

    loading = (item) => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                <span onClick={this.displayState}>"Loading {item}.."</span>
            </Col>
        </Row>
    );

    goBack = () => {
        console.log("trying to go back");
        this.props.history.replace('/');
    }

    urlTable = () => (
        <Row>
            <Col md={ {span: 10, offset: 1}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                <Table responsive bordered style={{"marginTop": "1rem"}}>
                    <thead style={theadStyle}>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Original URL</th>
                        <th>BBS-URL</th>
                        <th>Email</th>
                        <th>Hits</th>
                        <th>Created on</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.URLInfo.map( (url, index) => {
                        return (
                            <AdminURLRow key={url.shortURLEndPoint} url={url} set={this.indirectSetState} index={index} urls={this.state.URLInfo} />
                        );
                    })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );

    suborgTable = () => (
        <Row>
            <Col md={ {span: 10, offset: 1}} lg={ {span: 8, offset: 2}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                <Table responsive bordered style={{"marginTop": "1rem"}}>
                    <thead style={theadStyle}>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>No. of URLs</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.suborgInfo.map( (suborg, index) => {
                        return (
                            <AdminSuborgRow key={suborg.name} suborg={suborg} set={this.indirectSetState} index={index} suborgs={this.state.suborgInfo}/>
                        );
                    })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );

    userTable = () => (
        <Row>
            <Col md={ {span: 10, offset: 1}} lg={ {span: 8, offset: 2}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                <Table responsive bordered style={{"marginTop": "1rem"}}>
                    <thead style={theadStyle}>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>No. of URLs</th>
                        <th>Suborgs</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.userInfo.map( (user, index) => {
                        return (
                            <AdminUserRow key={user._id} user={user} set={this.indirectSetState} index={index} users={this.state.userInfo}/>
                        );
                    })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );

    emptyPage = (item) => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                {"No " + item}
            </Col>
        </Row>
    );


    render () {
        return (
            <Container>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                        <span onClick={this.goBack} style={HeadLinkStyle} >Dashboard</span> / Admin
                    </Col>
                </Row>

                {/*<CategoryURLCreator set={this.indirectSetState} urls={this.state.URLInfo} category={this.props.match.params.suborg}/>*/}
                {
                    this.state.userLoad === "loading" ? this.loading("User") : null
                }
                {
                    (JSON.stringify(this.state.userInfo) === JSON.stringify([]) && this.state.userLoad === "loaded")?
                        this.emptyPage("User")
                        : this.userTable()
                }
                {
                    this.state.suborgLoad === "loading" ? this.loading("Suborg") : null
                }
                {
                    (JSON.stringify(this.state.suborgInfo) === JSON.stringify([]) && this.state.suborgLoad === "loaded")?
                        this.emptyPage("Suborg")
                        : this.suborgTable()
                }
                {
                    this.state.URLLoad === "loading" ? this.loading("URL") : null
                }
                {
                    (JSON.stringify(this.state.URLInfo) === JSON.stringify([]) && this.state.URLLoad === "loaded")?
                        this.emptyPage("URL")
                        : this.urlTable()
                }

            </Container>
        );
    }
}


export default withRouter(Admin);
