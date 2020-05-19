import React, { useState } from "react";
import { useHistory, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios'
import ErrorAlert from "./ErrorAlert";


let password = React.createRef();
let passwordConfirm = React.createRef();
let passwordNew = React.createRef();

const ChangePassword = (props) =>{
    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    const [ isLoading, setLoading ] = useState(false);
    let history = useHistory();
    if(!props.currentState.authenticated){
        history.replace('/')
    }
    let submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        if(password.current.value === null || password.current.value === undefined || password.current.value === "" ){
            setError({
                isError: true,
                errorMessage: "Password cannot be empty"
            })
            setLoading(false);
            return;
        }
        if(passwordNew.current.value !== passwordConfirm.current.value){
            setError({
                isError: true,
                errorMessage: "Password and Confirm-Password fields must match"
            })
            setLoading(false);
            return;
        }
        if(passwordNew.current.value.length < 8){
            setError({
                isError: true,
                errorMessage: "Password should be of at least 8 characters"
            })
            setLoading(false);
            return;
        }
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
                    categories: response.data.data.user.suborgInfo,
                    numberOfURLs: response.data.data.user.numberOfURLs,
                    expiresAfter: response.data.expiresAfter,
                    role: response.data.expiresAfter
                }
                props.auth(user);
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
                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting…' : 'Submit'}
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
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={{fontSize:"0.85rem",
                    paddingBottom: "0",
                    paddingLeft: "0",
                    paddingRight: "0",
                    textAlign:"center",
                    marginTop:"1rem",
                    marginBottom:"1rem"}}>
                    Brought to you by <a style={{"color": "green"}} target="_blank" href="https://aashaypalliwar.github.io">Aashay Palliwar</a>
                </Col>
            </Row>
        </Container>
    );
}




export default ChangePassword;



