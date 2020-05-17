import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios'
import ErrorAlert from "./ErrorAlert";
import isLatLong from "validator/es/lib/isLatLong";

class ForgotPassword extends Component {
    state = {
        emailSent: false,
        email: "",
        isError: false,
        errorMessage: "",
        isLoading: false,
        isTokenBeingSent: false
    }
    email = React.createRef();
    submitHandler = (event) => {
        event.preventDefault();
        this.setState({isLoading: true});
        axios.post('/api/auth/forgotPassword',{email: this.email.current.value})
            .then((response) => {
                if(response.status === 200 && response.data.message === 'Token sent to email!'){
                    this.setState({emailSent: true, email: this.email.current.value});
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    console.log(error.response.data.message);
                    console.log(error.response.status);
                    this.email.current.value = "";
                    this.setState({
                        isError: true,
                        errorMessage: error.response.data.message,
                        isLoading: false
                    })
                }
            });

    }
    submitTokenHandler = (event) => {
        event.preventDefault();
        this.setState({isTokenBeingSent: true});
        axios.post('/api/auth/resetPassword',{
            resetToken: this.token.current.value,
            password: this.password.current.value,
            passwordConfirm: this.passwordConfirm.current.value
        })
            .then((response) => {
                if(response.status === 200 && response.statusText === 'OK'){
                    let user = {
                        _id: response.data.data.user._id,
                        name: response.data.data.user.name,
                        email: response.data.data.user.email,
                        suborg: response.data.data.user.suborg,
                        numberOfURLs: response.data.data.user.numberOfURLs,
                        expiresAfter: response.data.expiresAfter
                    }
                    this.props.auth(user);
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    console.log(error.response.data.message);
                    console.log(error.response.status);
                    if(error.response.status === 400 && error.response.data.message === 'Token is invalid or has expired'){
                        this.setState({
                            isError: true,
                            errorMessage: error.response.data.message,
                            emailSent : false,
                            isTokenBeingSent: false
                        })
                    }
                }
            });

    }

    emailField = (<Container>
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                Please enter your email for password recovery.
            </Col>
        </Row>
        <Row>
            <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 12}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                <Form onSubmit={this.submitHandler}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" ref={this.email}/>
                    </Form.Group>
                    <Button variant="success" style={{backgroundColor: "#093009"}} type="submit" disabled={this.state.isLoading}>
                        {this.state.isLoading ? "Sending Code.." : "Send Code"}
                    </Button>
                </Form>
            </Col>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}} style={{paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "1.5rem", paddingBottom: "2rem", marginTop:"1rem"}}>
                    { this.state.isError ? <ErrorAlert dismiss={() => {
                        this.setState({
                            isError: false,
                            errorMessage: ""
                        })
                    }} message={this.state.errorMessage}/> : null }
                </Col>
            </Row>
        </Row>
    </Container>)

    tokenField = (<Container>
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                Token has been sent to your email.
            </Col>
        </Row>
        <Row>
            <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 12}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                <Form onSubmit={this.submitTokenHandler}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" ref={this.email}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicToken">
                        <Form.Label>Token</Form.Label>
                        <Form.Control  placeholder="Enter Token" ref={this.token}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="New Password" ref={this.password} />
                    </Form.Group>
                    <Form.Group  controlId="formBasicPasswordConfirm">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" ref={this.passwordConfirm} />
                    </Form.Group>
                    <Button variant="success" style={{backgroundColor: "#093009"}} type="submit" disabled={this.state.isTokenBeingSent}>
                        {this.state.isTokenBeingSent ? "Changing Password..":"Change Password"}
                    </Button>
                </Form>
            </Col>
        </Row>
        <Row>
            <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}} style={{paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "1.5rem", paddingBottom: "2rem", marginTop:"1rem"}}>
                { this.state.isError ? <ErrorAlert dismiss={() => {
                    this.setState({
                        isError: false,
                        errorMessage: ""
                    })
                }} message={this.state.errorMessage}/> : null }
            </Col>
        </Row>
    </Container>)


    render(){
        return (!this.state.emailSent) ? this.emailField : this.tokenField
    }
}

export default ForgotPassword;



