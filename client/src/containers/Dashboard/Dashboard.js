import React, { Component } from 'react';

import Header from "../../components/Header/Header";
import {Col, Row, Table} from "react-bootstrap";

import {tableStyle} from "./dashboardStyle";

// import axios from 'axios';

class Dashboard extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        authenticated: true,
        email:'avp10@iitbbs.ac.in',
        role: 'user',
        numberOfURLs: null,
        URLinfo: [{originalURL : 'aashay.com', shortURLEndPoint: '8as56d', hits: 10, createdAt: 'Sunday' },{originalURL : 'aashdsfay.com', hits: 5, shortURLEndPoint: '8a889d', createdAt: 'Sunda78645y' }]
    }

    guestDashboard = () => {
        return (
          <h1>lol guests</h1>
        );
    }

    authDashboard = (role) => {
        if(role === 'user'){

            return(
                <div>
                    <Row style={{margin: 0}}>
                        <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                            Hi {this.state.email}, welcome to your dashboard!
                        </Col>
                    </Row>
                    {/*// <URLbar/>*/}
                    <div style={tableStyle}>
                        <Table responsive bordered>
                            <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Original URL</th>
                                <th>Short URL</th>
                                <th>Hits</th>
                                <th>Created at</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.URLinfo.map( (url, index) => {
                                return (
                                    <tr>
                                        <td> {index+1} </td>
                                        <td>{ url.originalURL }</td>
                                        <td>{ 'bbs.in/' + url.shortURLEndPoint}</td>
                                        <td>{url.hits}</td>
                                        <td>{url.createdAt}</td>
                                        <td>Action</td>
                                    </tr>
                                );
                            })}

                            {/*<tr>*/}
                            {/*    <td>1</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td>2</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td>3</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*    <td>Table cell</td>*/}
                            {/*</tr>*/}
                            </tbody>
                        </Table>
                    </div>
                </div>


            );
        }
        else if(role === 'admin'){

        }
    }

    render () {

        return (
            <div>
                {!this.state.authenticated?this.guestDashboard():this.authDashboard(this.state.role)}
            </div>
        );
    }
}


export default Dashboard;
