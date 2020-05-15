import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from "react-router";

const Token = (props) =>{
    let history = useHistory();
    let token = React.createRef();
    if(props.location === undefined){
        history.replace('/');
        return null;
    }

    let submitHandler = (event) => {
        event.preventDefault();
        let payload = {
            email: props.location.state.email,
            verificationToken: token.current.value
        }
        axios.post('http://localhost:8080/api/auth/verifyEmail', payload).then((response)=>{
            console.log(response);
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
        }).catch((error)=>{
            console.log(error);
            if (error.response) {
                console.log(error.response.data.message);
                console.log(error.response.status);
            }
        })
    }
    let resendTokenHandler = () => {
        axios.post('/api/auth/resendVerificationEmail', {email : props.location.state.email}).then((response)=>{
            console.log(response);
            if(response.status === 200 && response.statusText === 'OK'){
                token.current.value = "";
            }
        }).catch((error)=>{
            console.log(error);
            if (error.response) {
                console.log("resend fail");
                console.log(error.response.data.message);
                console.log(error.response.status);
            }
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

                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit">
                            Submit
                        </Button>
                        <a style={{color: "#093009", fontSize: "0.9rem", margin: "1rem", cursor: "pointer"}} >
                            <span onClick={resendTokenHandler}>Resend Token</span>
                        </a>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

// marginLeft:"1rem",marginRight:"1rem"


export default withRouter(Token);



