import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { withRouter } from "react-router";
import ls from 'local-storage';
import Header from "../../components/Header/Header";
import {Col, Row, Table} from "react-bootstrap";
import Dashboard from "../Dashboard/Dashboard";
import Guest from "../../components/Guest";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";
import Token from "../../components/Token";
import { withCookies } from 'react-cookie';

import axios from 'axios';
import ChangePassword from "../../components/ChangePassword";
import ForgotPassword from "../../components/ForgotPassword";

class Wrapper extends Component {

    state = {
        authenticated: false,
        _id: null,
        email: null,
        name: null,
        role: 'user',
        suborg: null,
        numberOfURLs: null,
        // URLinfo: [{originalURL : 'aashay.com', shortURLEndPoint: '8as56d', hits: 10, createdAt: 'Sunday' },{originalURL : 'aashdsfay.com', hits: 5, shortURLEndPoint: '8a889d', createdAt: 'Sunda78645y' }]
        URLInfo : null
    }

    constructor(props) {
        super(props);
        let isAuth = false;
        if(ls('user') !== null){
            let user = JSON.parse(ls.get('user'));
            if(Date.now() < user.expiresAfter)
                isAuth = true;
        }

        if(isAuth){
            let user = JSON.parse(ls.get('user'));
            this.state = {
                authenticated: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                suborg: user.suborg,
                numberOfURLs: user.numberOfURLs,
                URLInfo : null
            };
        }else{
            this.state = {
                authenticated: false,
                _id: null,
                email: null,
                name: null,
                role: 'user',
                suborg: null,
                numberOfURLs: null,
                URLInfo : null
            }
        }
    }

    //componentDid mount
    //if authed get the url data and update state.
    //if not authed do nothing.
    authHandler = (user) => {
            ls.clear();
            ls.set('user', JSON.stringify(user));
            this.setState({
                authenticated: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                suborg: user.suborg,
                numberOfURLs: user.numberOfURLs
            });
            this.props.history.replace('/');
    }

    toggleAuth = () => {
        this.setState({authenticated: !this.state.authenticated});
    }

    render () {

        return (
            <div>
                <header>
                    <Header authenticated={this.state.authenticated} toggle={this.toggleAuth} />
                </header>
                <Route path='/' exact render={ () => (!this.state.authenticated) ? <Guest/>:<Dashboard/>}/>
                <Route path='/login' exact render={ () => <Login isAuth={this.state.authenticated} auth={this.authHandler}/>} />
                <Route path='/signup' exact render={ () => <SignUp/>} />
                <Route path='/forgotPassword' exact render={ () => <ForgotPassword auth={this.authHandler}/>} />
                <Route path='/changePassword' exact render={ () => <ChangePassword currentState={this.state} auth={this.authHandler}/>} />
                <Route path='/verifyEmail' exact render={ () => <Token auth={this.authHandler}/>} />
            </div>
        );
    }
}
// export default withCookies(Wrapper);
export default withCookies(withRouter(Wrapper));


// axios.post('http://localhost:8080/api/user/url',{
//
//     "originalURL": "https://www.livemint.com/news/india/maharashtra-coronavirus-positive-cases-jump-to-338-death-toll-at-16-11585799822758.html",
//     "wantCustomURL": true,
//     "customURL": "didi"
// }, { withCredentials: true }).then((res)=>{console.log(res)}).catch((err)=>console.log(err))
// {/*<Token location={{state: {email: "avp10@iitbbs.ac.in"}}} />*/}
