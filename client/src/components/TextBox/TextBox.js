import React from 'react';
import { Form, Button } from 'react-bootstrap';
// eslint-disable-next-line
import { textBlock, textDiv } from './textBoxStyle';


const TextBox = (props) =>{


    return (
        <div style={textDiv}>
                <Form inline>
                    <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
                    <Button >Search</Button>
                </Form>
        </div>

    );
}




export default TextBox;

