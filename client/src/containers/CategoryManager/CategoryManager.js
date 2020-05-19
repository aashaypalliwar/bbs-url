import React, { Component } from 'react';
import { withRouter } from "react-router";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import axios from 'axios';
import { headingStyle, textStyle, theadStyle, categoryStyle, descriptionStyle, bodyTextStyle, breadStyle, linkStyle, HeadLinkStyle } from "./CategoryStyles";
import {Link} from "react-router-dom";
import RootCreator from "../../components/RootCreator";
import RootRow from "../../components/RootRow";
import CategoryRow from "../../components/CategoryRow";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import CategoryURLCreator from "../../components/CategoryURLCreator";
import CategoryURLRow from "../../components/CategoryURLRow";


class CategoryManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfURLs: null,
            URLInfo : [],
            loadState: "loading"
        }
        console.log("categurlconstructor worked");
        console.log("printing state", this.state);
    }


    componentDidMount() {
        console.log("inside cdm");
        console.log("printing state", this.state);
        axios.get(`/api/suborg/?suborg=${this.props.match.params.suborg}`, { withCredentials: true})
            .then((response) => {
                if(response.status === 200){
                    console.log(response);
                    console.log("fetched  url info")
                    this.setState({URLInfo: response.data.URLData, loadState: "loaded"})
                    console.log("printing state", this.state);
                }
            })
            .catch((error) => {
                console.log(error);
                //throw error
                console.log("Couldnot fetch data")
            })
        console.log("fetch data worked")
    }

    indirectSetState = (newState) => {
        this.setState(newState);
    }

    displayState = () => console.log(this.state);

    loading = () => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                <span onClick={this.displayState}>"Loading.."</span>
            </Col>
        </Row>
    );

    goBack = () => {
        console.log("trying to go back");
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
                            <CategoryURLRow key={url.shortURLEndPoint} url={url} set={this.indirectSetState} index={index} urls={this.state.URLInfo} category={this.props.match.params.suborg}/>
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
                {"You do not have any short/custom URL under this category yet. Make one now !"}
            </Col>
        </Row>
    );


    render () {
        return (
            <Container>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                        <span onClick={this.goBack} style={HeadLinkStyle} >Dashboard</span> / Category Manager - {this.props.match.params.suborg}
                    </Col>
                </Row>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                        Create a custom or random URL that maps to any website!
                    </Col>
                </Row>
                <CategoryURLCreator set={this.indirectSetState} urls={this.state.URLInfo} category={this.props.match.params.suborg}/>
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
                            <span style={{"fontSize": "1.3rem", "color": "#093009"}}>Categorized short/custom URLs</span><br/>
                            One may create short/custom URLs that can be grouped under the particular category (which here is "{ this.props.match.params.suborg }"). eg. under the category "endsem" one may create:<br/>1. A random URL like <a style={{"color":"green"}}>bbsurl.in/endsem/Asd2It</a> that points to your google-drive notes folder and share this with your pals.<br/>
                            2. Or, may be you can map the link to your favourite youtube tutorial to <a  style={{"color":"green"}}>bbsurl.in/endsem/graphs</a>. You can delete a given category in one go as well.<br/><br/>
                            Your imagination is the limit! You have stumbled upon the one solution to long URLs and cluttered bookmark tools.

                        </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}


export default withRouter(CategoryManager);
