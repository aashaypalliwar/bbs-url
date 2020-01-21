import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const ResetPassword = (props) =>{


    return (
        <Container>
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                   Hi {props.email}, please enter the details to continue.
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 12}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form >
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" placeholder="Current Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" placeholder="New Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" />
                        </Form.Group>
                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit">
                            SUBMIT
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}




export default ResetPassword;



