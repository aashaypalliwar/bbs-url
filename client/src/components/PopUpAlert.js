import {Button} from "react-bootstrap";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";

const PopUpAlert = (props) => {

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.heading}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.body}</Modal.Body>
            <Modal.Footer>
                <span style={{"paddingRight": "0.5rem"}}>{props.footer}</span>
                <Button variant="secondary" disabled={props.isLoading} onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant={props.variant} disabled={props.isLoading} onClick={props.fireFunction}>
                    {props.isLoading? "Processing" : props.buttonToTrigger}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PopUpAlert;

