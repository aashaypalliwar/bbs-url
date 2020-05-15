import React, { Component } from 'react';
// import Header from './components/Header/Header';
// import ResetPassword from './components/ResetPassword';
// import Token from './components/Token'
// import Login from './components/Login';
// import TextBox from './components/TextBox/TextBox';
// import Dashboard from "./containers/Dashboard/Dashboard";
import Wrapper from "./containers/Wrapper/Wrapper";
import { BrowserRouter, Route } from 'react-router-dom';
import { CookiesProvider, withCookies } from 'react-cookie';

// import { bgImg } from "./indexStyle";

class App extends Component {

    render(){
        return(
            <CookiesProvider>
                <BrowserRouter>
                    <Wrapper cookies={this.props.cookies}/>
                </BrowserRouter>
            </CookiesProvider>
        );
    }
}


export default withCookies(App);
