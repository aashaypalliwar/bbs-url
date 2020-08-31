import React, { Component } from 'react';
import Wrapper from "./containers/Wrapper/Wrapper";
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider, withCookies } from 'react-cookie';
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
