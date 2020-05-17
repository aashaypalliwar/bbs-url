import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";

let email = React.createRef();
let password = React.createRef();
let passwordConfirm = React.createRef();
let name = React.createRef();

const SignUp = (props) =>{

    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    const [ isLoading, setLoading ] = useState(false);
    let history = useHistory();

    if(props.isAuth){
        history.replace('/');
    }

    let submitHandler = (event)=>{
        event.preventDefault();
        setLoading(true);
        let payload = {
            email: email.current.value,
            password: password.current.value,
            passwordConfirm: passwordConfirm.current.value,
            name: name.current.value
        }
        console.log(payload);
        axios.post('/api/auth/signup', payload).then((response)=>{
            console.log(response);
            if(response.status === 201 && response.statusText === 'Created'){
                history.push( {
                    pathname: '/verifyEmail',
                    state: { email: payload.email }});
            }
        }).catch((error)=>{
            console.log(error);
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

    return (
        <Container>
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                    Please Sign Up to continue
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form onSubmit={submitHandler} >
                        <Form.Group controlId="formName" >
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control  placeholder="Enter your name" ref={name} />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail" >
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email" ref={email} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" >
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password"  ref={password} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" ref={passwordConfirm} />
                        </Form.Group>
                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting…' : 'Sign Up'}
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




export default SignUp;



