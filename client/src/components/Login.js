import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import ErrorAlert from "./ErrorAlert";
import { withRouter } from "react-router";

const Login = (props) =>{
    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    const [ isLoading, setLoading ] = useState(false);

    let history = useHistory();
    let email = React.createRef();
    let password = React.createRef();
    if(props.isAuth === true){
        history.push('/');
        return null;
    }

    let submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        let payload = {
            email: email.current.value,
            password: password.current.value
        }
        axios.post('/api/auth/login', payload).then((response)=>{
            if(response.status === 200 && response.data.message === 'Please verify your email'){
                history.push( {
                    pathname: '/verifyEmail',
                    state: { email: payload.email }});
            }
            else if(response.status === 200 && response.statusText === 'OK'){
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
        }).catch((error)=>{
            console.log(error);
            if (error.response) {
                console.log(error.response.data.message);
                console.log(error.response.status);
                setLoading(false);
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
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                    Please login to continue
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" ref={email}/>
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" ref={password} />
                        </Form.Group>
                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit" disabled={isLoading}>
                            {isLoading ? 'Loading…' : 'Login'}
                        </Button>
                        <Link style={{color: "#093009", fontSize: "0.9rem", margin: "1.5rem"}} to='/forgotPassword'>
                            Forgot Password
                        </Link>
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




export default Login;



