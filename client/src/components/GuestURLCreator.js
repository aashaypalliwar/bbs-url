import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {linkStyle} from "../containers/Guest/GuestStyles";
import React, { useState, useRef } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";
import InputGroup from "react-bootstrap/InputGroup";
import { clone } from 'ramda'

const GuestURLCreator = (props) => {
    const [ isLoading, setLoading ] = useState(false);
    const [ isCustom, setCustom ] = useState(false);
    const [ isResultAvailable, setResultAvailable ] = useState(false);
    const [ resultantURL, setResultantURL ] = useState("");
    const [ resultantURLEndpoint, setResultantURLEndpoint ] = useState("");
    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    let history = useHistory();
    let originalURL = useRef();
    let customURL = useRef();
    let checkBox = useRef();

    let checkBoxHandler = () => {
        setCustom(!isCustom);
    }

    let resetForm = () => {
        setCustom(false);
        setResultAvailable(false);
        originalURL.current.value = "";
        console.log(originalURL)//.current.value = ""
        console.log(checkBox);
    }

    let getRefVal = (customRef) => {
        if(customRef.current === undefined)
            return " ";
        else return customRef.current.value;
    }

    let displayCreatedURL = (url) => {
        setResultantURL("bbsurl.in/" + url);
        setResultantURLEndpoint(url);
        setResultAvailable(true);
    }

    let submitHandler =  (event) => {
        event.preventDefault();
        let newURLs = clone(props.urls);
        setLoading(true);

        console.log(originalURL.current.value);
        console.log(customURL);
        console.log(checkBox)
        console.log(getRefVal(customURL));
        let payLoad = {
            originalURL: originalURL.current.value,
            customURL: getRefVal(customURL),
            wantCustomURL: isCustom
        }
        console.log(props);
        axios.post('/api/guest/url', payLoad)
            .then((response) => {
                console.log(response);
                if(response.status === 201 && response.statusText === 'Created'){
                    let newURL =
                        {
                            _id: response.data.newURLData._id,
                            suborg: response.data.newURLData.suborg,
                            hits: response.data.newURLData.hits,
                            createdAt: response.data.newURLData.createdAt,
                            blacklisted: response.data.newURLData.blacklisted,
                            email: response.data.newURLData.email,
                            name: response.data.newURLData.name,
                            userID: response.data.newURLData.userID,
                            shortURLEndPoint: response.data.newURLData.shortURLEndPoint,
                            originalURL: response.data.newURLData.originalURL,
                            __v: response.data.newURLData.__v
                        };

                    //console.log(props.managerState.URLInfo);
                    console.log("inside req");
                    console.log(originalURL);
                    console.log(customURL);
                    displayCreatedURL(newURL.shortURLEndPoint);
                    setLoading(false);
                }
            }).catch((error) => {
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
                        errorMessage: "Something went wrong!" + error.message
                    })
                }
                resetForm();
                setLoading(false);
        })
    }

    return (
        <Container>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="categoryNameField">
                            <Form.Label>Original URL</Form.Label>
                            <Form.Control type="text" placeholder="Enter Original URL" ref={originalURL}/>
                        </Form.Group>
                        {
                            isCustom ?
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon3">
                                            bbsurl.in/
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control id="basic-url" aria-describedby="basic-addon3" placeholder="Custom Endpoint" maxLength={20} ref={customURL} />
                                </InputGroup> : null
                        }
                        <Form.Row>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Custom URL" checked={isCustom} onChange={checkBoxHandler} ref={checkBox} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Button variant="success" style={{backgroundColor: "#093009", "marginRight": "1rem"}} type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating…' : 'Create'}
                            </Button>
                            <Button variant="success" style={{backgroundColor: "#318f4a"}} onClick={resetForm} disabled={isLoading}>
                                Reset
                            </Button>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label >
                                <br/>{ isResultAvailable ? <span><a href={resultantURLEndpoint} style={linkStyle} target="_blank">{resultantURL}</a>{` - will redirect to your chosen URL.`}</span> : "Your Short URL will look like : bbsurl.in/Qw8Plk or bbsur.in/bbsurl"}
                            </Form.Label>
                        </Form.Row>
                    </Form>
                </Col>
            </Row>
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

export default GuestURLCreator;

//ref={isCustom? dummy:customURL}
