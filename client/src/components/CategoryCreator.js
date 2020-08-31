import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {textStyle} from "../containers/LandingPage/LandingStyles";
import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";

const CategoryCreator = (props) => {
    const [ isLoading, setLoading ] = useState(false);
    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    let history = useHistory();
    let categoryName = React.createRef();
    let categoryDescription = React.createRef();
    let submitHandler =  (event) => {
        event.preventDefault();
        setLoading(true);
        let payLoad = {
            suborgName: categoryName.current.value,
            description: categoryDescription.current.value,
        }
        categoryName.current.value = "";
        categoryDescription.current.value = "";
        axios.post('/api/suborg', payLoad, { withCredentials: true })
            .then((response) => {
                if(response.status === 201){
                    let categories = [...props.landingPageState.categories,
                        {
                            _id: response.data.newSuborgData._id,
                            name: payLoad.suborgName,
                            description: payLoad.description
                        }];

                    props.set({ categories: categories });
                }
                setLoading(false);
            }).catch((error) => {
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
                setLoading(false);
        })
    }

    return (
        <Container>
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
            <Row>
                <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                    Create a new category
                </Col>
            </Row>
            <Row>
                <Col md={ {span: 6, offset: 3}} lg={ {span: 4, offset: 4}} sm={ {span: 10, offset:1}} xs={{span:10, offset:1}}     style={{padding: "1.5rem", marginTop:"0.25rem", borderRadius:"1rem", border:"medium solid #093009"}}>
                    <Form onSubmit={submitHandler}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="categoryNameField">
                                <Form.Control type="text" maxLength={20} placeholder="Category" ref={categoryName}/>
                            </Form.Group>
                            <Form.Group  as={Col} controlId="categoryDescription">
                                <Form.Control type="text" maxLength={30} placeholder="Description" ref={categoryDescription} />
                            </Form.Group>
                        </Form.Row>
                        <Button variant="success" style={{backgroundColor: "#093009"}} type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating…' : 'Create'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default CategoryCreator;

