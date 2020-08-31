import React from "react";
import Alert from 'react-bootstrap/Alert'

const ErrorAlert = (props) => {
        return (
            <Alert variant="danger" onClose={() => props.dismiss()} dismissible>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                    {props.message}
                </p>
            </Alert>
        );
}

export default ErrorAlert;
