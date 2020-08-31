import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import ls from 'local-storage';
import Header from "../../components/Header/Header";
import Guest from "../Guest/Guest";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";
import Token from "../../components/Token";
import { withCookies } from 'react-cookie';

import axios from 'axios';
import ChangePassword from "../../components/ChangePassword";
import ResetPasswordToken from "../../components/ResetPasswordToken";
import ForgotPassword from "../../components/ForgotPassword";
import LandingPage from "../LandingPage/LandingPage";
import RootManager from "../RootManager/RootManager";
import CategoryManager from "../CategoryManager/CategoryManager";
import Admin from "../Admin/Admin";

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

    componentDidMount() {
        let shouldUpdate = false;
        let updatedCategories;
        if(this.state.authenticated){
            axios.get('/api/user/suborg', { withCredentials: true})
                .then((response) => {
                    if(response.status === 200){
                        if(response.data.categories.length !== this.state.categories.length){
                            shouldUpdate = true;
                            updatedCategories = [...response.data.categories];
                        }
                    }
                })
                .then(()=>{
                    if(shouldUpdate){
                        this.setState({categories: updatedCategories});
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
                <Route path='/admin' exact render={ () => (this.state.role !== "admin") ? <Redirect to='/'/>:<Admin appState={this.state} set={this.indirectStateSetter}/>}/>
                <Route path='/dashboard/root' exact render={ () => (!this.state.authenticated) ? <Redirect to='/'/>:<RootManager appState={this.state} set={this.indirectStateSetter}/>}/>
                <Route path='/dashboard/category/:suborg' exact render={ () => (!this.state.authenticated) ? <Redirect to='/'/>:<CategoryManager appState={this.state} set={this.indirectStateSetter}/>}/>
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

export default withCookies(withRouter(Wrapper));

