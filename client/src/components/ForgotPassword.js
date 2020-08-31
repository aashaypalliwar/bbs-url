import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";

let email = React.createRef();
let password = React.createRef();
let passwordConfirm = React.createRef();
let name = React.createRef();

const ForgotPassword = (props) =>{

    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    const [ isLoading, setLoading ] = useState(false);
    let history = useHistory();

    let submitHandler = (event)=>{
        event.preventDefault();
        setLoading(true);
        axios.post('/api/auth/forgotPassword',{email: email.current.value})
            .then((response) => {
                if(response.status === 200 && response.data.message === 'Token sent to email!'){
                    history.push( {
                        pathname: '/resetPassword',
                        state: { email: email.current.value }});
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data.message);
                    console.log(error.response.status);
                    email.current.value = "";
                    setError({
                        isError: true,
                        errorMessage: error.response.data.message
                    })
                }else{
                    setError({
                        isError: true,
                        errorMessage: "Something went wrong!"
                    })
                }
                setLoading(false);
            });
    }

    return (
        <Container>
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                    Please enter your email for password recovery.
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 12}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter your email" ref={email}/>
                        </Form.Group>
                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit" disabled={isLoading}>
                            {isLoading ? "Sending Code.." : "Send Code"}
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}} style={{paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "1.5rem", paddingBottom: "2rem", marginTop:"1rem"}}>
                    { errorStatus.isError ? <ErrorAlert dismiss={() => {
                        setError({
                            isError: false,
                            errorMessage: ""
                        })
                    }} message={errorStatus.errorMessage}/> : null }
                </Col>
            </Row>
        </Container>
    );
}


export default ForgotPassword;