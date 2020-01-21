import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Token = (props) =>{


    return (
        <Container>
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                    Hi {props.email}, please enter the token sent to your mail.
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 12}}   style={{padding: "1.5rem", marginTop:"0.40rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                        <Form inline>
                            <Form.Control type="text" placeholder="Token" className="mr-sm-2" />
                            <Button variant="success" style={{backgroundColor: "#093009"}}>Submit</Button>
                        </Form>
                </Col>
            </Row>
        </Container>
    );
}

// marginLeft:"1rem",marginRight:"1rem"


export default Token;



