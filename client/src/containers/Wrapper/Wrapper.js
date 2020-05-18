import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
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
import ResetPasswordToken from "../../components/ResetPasswordToken";
import ForgotPassword from "../../components/ForgotPassword";
import LandingPage from "../LandingPage/LandingPage";
import RootCreator from "../../components/RootCreator";
import RootManager from "../RootManager/RootManager";

class Wrapper extends Component {
    constructor(props) {
        super(props);
        let authenticated = false;
        if(ls('user') !== null){
            let user = JSON.parse(ls.get('user'));
            if(Date.now() < user.expiresAfter)
                authenticated = true;
        }

        if(authenticated){
            let user = JSON.parse(ls.get('user'));
            user.authenticated = true;
            this.state = {
                ...user
            };
        }else{
            ls.clear();
            this.state = {
                authenticated: false,
                _id: null,
                email: null,
                name: null,
                role: null,
                suborg: [],
                categories: [],
                numberOfURLs: null,
            }
        }
    }

    //componentDid mount
    //if authed get the url data and update state.
    //if not authed do nothing.

    componentDidMount() {
        let shouldUpdate = false;
        let updatedCategories;
        if(this.state.authenticated){
            axios.get('/api/user/suborg', { withCredentials: true})
                .then((response) => {
                    if(response.status === 200 && response.statusText === 'OK'){
                        if(response.data.categories.length !== this.state.categories.length){
                            shouldUpdate = true;
                            updatedCategories = [...response.data.categories];
                        }
                    }
                })
                .then(()=>{
                    if(shouldUpdate){
                        this.setState({categories: updatedCategories});
                        console.log("had to sync category info");
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        ls.clear();
        ls.set('user', JSON.stringify(this.state));
        console.log("ls synced");
    }

    authHandler = (user) => {
            ls.clear();
            user.authenticated = true
            ls.set('user', JSON.stringify(user));
            this.setState({
                ...user
            });
            this.props.history.replace('/');
    }

    toggleAuth = () => {
        this.indirectStateSetter({authenticated: !this.state.authenticated});
    }

    indirectStateSetter = (newState) => {
        this.setState(newState);
    }

    render () {

        return (
            <div>
                <header>
                    <Header authenticated={this.state.authenticated} toggle={this.toggleAuth} />
                </header>
                <Route path='/' exact render={ () => (!this.state.authenticated) ? <Guest/>:<Redirect to='/dashboard'/>}/>
                {/*<Route path='/dashboard' render={ () => (!this.state.authenticated) ? <Redirect to='/'/>:<Dashboard appState={this.state} set={this.indirectStateSetter}/>}/>*/}
                <Route path='/dashboard' exact render={ () => (!this.state.authenticated) ? <Redirect to='/'/>:<LandingPage appState={this.state} set={this.indirectStateSetter}/>}/>
                <Route path='/dashboard/root' render={ () => (!this.state.authenticated) ? <Redirect to='/'/>:<RootManager appState={this.state} set={this.indirectStateSetter}/>}/>
                <Route path='/login' exact render={ () => <Login isAuth={this.state.authenticated} auth={this.authHandler}/>} />
                <Route path='/signup' exact render={ () => <SignUp isAuth={this.state.authenticated}/>} />
                <Route path='/forgotPassword' exact render={ () => <ForgotPassword auth={this.authHandler}/>} />
                <Route path='/changePassword' exact render={ () => <ChangePassword currentState={this.state} auth={this.authHandler}/>} />
                <Route path='/verifyEmail' exact render={ () => <Token auth={this.authHandler}/>} />
                <Route path='/resetPassword' exact render={ () => <ResetPasswordToken auth={this.authHandler}/>} />
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
