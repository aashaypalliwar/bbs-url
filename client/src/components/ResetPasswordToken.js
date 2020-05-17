import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from "react-router";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";

const ResetPasswordToken = (props) =>{
    let token = React.createRef();
    let password = React.createRef();
    let passwordConfirm = React.createRef();

    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    });
    const [ successStatus, setSuccess ] = useState({
        isSuccess: false,
        successMessage: ""
    })
    const [ isLoading, setLoading ] = useState(false);
    const [ isResending, setResend ] = useState(false);

    let history = useHistory();
    if(props.location === undefined){
        history.replace('/');
        return null;
    }

    let submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        axios.post('/api/auth/resetPassword',{
            resetToken: token.current.value,
            password: password.current.value,
            passwordConfirm: passwordConfirm.current.value
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
                    props.auth(user);
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    console.log(error.response.data.message);
                    console.log(error.response.status);
                    if(error.response.status === 400 && error.response.data.message === 'Token is invalid or has expired'){
                        setError({
                            isError: true,
                            errorMessage: error.response.data.message
                        })
                        setLoading(false);
                    }
                }
            });
    }
    let resendTokenHandler = () => {
        setResend(true);
        axios.post('/api/auth/forgotPassword',{email: props.location.state.email})
            .then((response) => {
                console.log(response);
                if(response.status === 200 && response.data.message === 'Token sent to email!'){
                    setSuccess({
                        isSuccess: true,
                        successMessage: response.data.message
                    })
                    setResend(false);
                }
            })
            .catch((error)=>{
                console.log(error);
                if (error.response) {
                    console.log("resend fail");
                    console.log(error.response.data.message);
                    console.log(error.response.status);
                    setResend(false);
                    setError({
                        isError: true,
                        errorMessage: error.response.data.message
                    })
            }
        })
    }



    return (
        <Container>
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                    Token has been sent to your email.
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 12}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="formBasicToken">
                            <Form.Label>Token</Form.Label>
                            <Form.Control  placeholder="Enter Token" ref={token}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" placeholder="New Password" ref={password} />
                        </Form.Group>
                        <Form.Group  controlId="formBasicPasswordConfirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" ref={passwordConfirm} />
                        </Form.Group>
                        <Button variant="success" style={{backgroundColor: "#093009", marginRight: "1rem"}} type="submit" disabled={isLoading || isResending}>
                            {isLoading ? "Changing..":"Change Password"}
                        </Button>
                        <Button variant="success" style={{backgroundColor: "#093009"}} onClick={resendTokenHandler} disabled={isLoading || isResending}>
                            {isResending ? "Resending.." : "Resend Token"}
                        </Button>
                        {/*<a style={{color: "#093009", fontSize: "0.9rem", margin: "1rem", cursor: "pointer"}} >*/}
                        {/*    <span onClick={resendTokenHandler}>Resend Token</span>*/}
                        {/*</a>*/}
                    </Form>
                </Col>
            </Row>
            { successStatus.isSuccess ?
                <Row>
                    <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}} style={{paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "1.5rem", paddingBottom: "2rem", marginTop:"1rem"}}>
                        <SuccessAlert dismiss={() => {
                            setSuccess({
                                isSuccess: false,
                                successMessage: ""
                            })
                        }} message={successStatus.successMessage}/>
                    </Col>
                </Row>
                : null
            }
            { errorStatus.isError ?
                <Row>
                    <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}} style={{paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "1.5rem", paddingBottom: "2rem", marginTop:"1rem"}}>
                        <ErrorAlert dismiss={() => {
                            setError({
                                isError: false,
                                errorMessage: ""
                            })
                        }} message={errorStatus.errorMessage}/>
                    </Col>
              </Row>
                : null
            }
        </Container>
    );
}

// marginLeft:"1rem",marginRight:"1rem"


export default withRouter(ResetPasswordToken);



