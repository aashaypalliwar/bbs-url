import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Login = (props) =>{


    return (
        <Container>
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                    Please login to continue
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 12}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit">
                            Login
                        </Button>
                        <a style={{color: "#093009", fontSize: "0.9rem", margin: "1.5rem"}} href="#forgotpwd">
                            Forgot Password
                        </a>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}




export default Login;



