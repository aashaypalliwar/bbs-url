import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios'


let password = React.createRef();
let passwordConfirm = React.createRef();
let passwordNew = React.createRef();

const ChangePassword = (props) =>{
    let history = useHistory();
    if(!props.currentState.authenticated){
        history.replace('/')
    }
    let submitHandler = (event) => {
        event.preventDefault();
        axios.post('/api/auth/updatePassword', {
            _id: props.currentState._id,
            password: password.current.value,
            passwordNew: passwordNew.current.value,
            passwordConfirm: passwordConfirm.current.value
        }).then((response)=>{
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


    return (
        <Container>
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 12}} style={{fontSize:"1.5rem",paddingBottom: "0", paddingLeft: "0", paddingRight: "0", textAlign:"center", marginTop:"1rem"}}>
                   Hi {props.currentState.name}, please enter the details to continue.
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 12}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" placeholder="Current Password" ref={password} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPasswordNew">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" placeholder="New Password" ref={passwordNew}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPasswordConfirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" ref={passwordConfirm}/>
                        </Form.Group>
                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}




export default ChangePassword;



