import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from "react-router";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";

const Token = (props) =>{
    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    const [ successStatus, setSuccess ] = useState({
        isSuccess: false,
        successMessage: ""
    })
    const [ isLoading, setLoading ] = useState(false);
    const [ isResending, setResend ] = useState(false);
    let history = useHistory();
    let token = React.createRef();
    if(props.location === undefined){
        history.replace('/');
        return null;
    }

    let submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        if(token.current.value === null || token.current.value === undefined || token.current.value === "" ){
            setError({
                isError: true,
                errorMessage: "Token cannot be empty"
            })
            setLoading(false);
            return;
        }
        let payload = {
            email: props.location.state.email,
            verificationToken: token.current.value
        }
        axios.post('/api/auth/verifyEmail', payload).then((response)=>{
            //console.log(response);
            if(response.status === 200){
                let user = {
                    _id: response.data.data.user._id,
                    name: response.data.data.user.name,
                    email: response.data.data.user.email,
                    suborg: response.data.data.user.suborg,
                    categories: response.data.data.user.suborgInfo,
                    numberOfURLs: response.data.data.user.numberOfURLs,
                    expiresAfter: response.data.expiresAfter,
                    role: response.data.data.user.role
                }
                props.auth(user);
            }
        }).catch((error)=>{
            //console.log(error);
            if (error.response) {
                console.log(error.response.data.message);
                console.log(error.response.status);
                setError({
                    isError: true,
                    errorMessage: error.response.data.message
                })
            }
            else{
                setError({
                    isError: true,
                    errorMessage: "Something went wrong!"
                })
            }
            setLoading(false);
        })
    }
    let resendTokenHandler = () => {
        setResend(true)
        axios.post('/api/auth/resendVerificationEmail', {email : props.location.state.email}).then((response)=>{
            //console.log(response);
            if(response.status === 200){
                setSuccess({
                    isSuccess: true,
                    successMessage: "Please check your inbox for the new token."
                })
                setResend(false);
            }
        }).catch((error)=>{
            //console.log(error);
            if (error.response) {
                //console.log("resend fail");
                console.log(error.response.data.message);
                console.log(error.response.status);
                setError({
                    isError: true,
                    errorMessage: error.response.data.message
                })
            }
            else{
                setError({
                    isError: true,
                    errorMessage: "Something went wrong!"
                })
            }
            setResend(false);
        })
    }



    return (
        <Container>
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                    Hi {props.location.state.email}, please enter the token sent to your mail.
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="token">
                            <Form.Label>Email Verification Token</Form.Label>
                            <Form.Control placeholder="Enter Token" ref={token} />
                        </Form.Group>

                        <Button variant="success" style={{backgroundColor: "#093009", marginRight: "1rem"}} type="submit" disabled={isLoading || isResending}>
                            {isLoading ? 'Sending…' : 'Submit'}
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
            {/*<Row>*/}
            {/*    <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}} style={{paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "1.5rem", paddingBottom: "2rem", marginTop:"1rem"}}>*/}
            {/*        { errorStatus.isError ? <ErrorAlert dismiss={() => {*/}
            {/*            setError({*/}
            {/*                isError: false,*/}
            {/*                errorMessage: ""*/}
            {/*            })*/}
            {/*        }} message={errorStatus.errorMessage}/> : null }*/}
            {/*    </Col>*/}
            {/*</Row>*/}
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


export default withRouter(Token);



