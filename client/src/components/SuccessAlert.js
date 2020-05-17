import React, { useState } from "react";
import Alert from 'react-bootstrap/Alert'
import Button from "react-bootstrap/Button";

const SuccessAlert = (props) => {
        return (
            <Alert variant="success" onClose={() => props.dismiss()} dismissible>
                <Alert.Heading>Success</Alert.Heading>
                <p>
                    {props.message}
                </p>
            </Alert>
        );
}

export default SuccessAlert;
