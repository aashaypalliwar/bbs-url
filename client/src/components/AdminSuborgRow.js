import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {categoryStyle, whiteStyle, descriptionStyle, textStyle, deleteStyle, linkStyle} from "../containers/Admin/AdminStyles";
import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";
import PopUpAlert from "./PopUpAlert";
import { clone } from "ramda"

const AdminSuborgRow = (props) => {
    const [ isLoading, setLoading ] = useState(false);
    const [ isBlacklisted, setBlacklisted ] = useState(props.suborg.blacklisted);
    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);
    let history = useHistory();

    let triggerDeleteModal = () => {
        setShowDelete(true);
    }

    let whiteList = () => {
        console.log(props.suborgs);
        let users = clone(props.suborgs);
        let id = props.suborg._id;
        console.log("before req");
        axios.put(`/api/admin/suborg`, { blacklisted: 0, _id: id },{ withCredentials: true } )
            .then((response) => {
                console.log(response);
                if(response.status === 200){
                    setBlacklisted(false);
                }
            }).catch((error) => {
            console.log(error);
            if (error.response) {
                console.log(error.response.data.message);
                console.log(error.response.status);
            }
        })
    }

    let blackList = () => {
        console.log(props.suborgs);
        let urls = clone(props.suborgs);
        let id = props.suborg._id;
        console.log("before req");
        axios.put(`/api/admin/suborg`, { blacklisted: 1, _id: id },{ withCredentials: true } )
            .then((response) => {
                console.log(response);
                if(response.status === 200){
                    setBlacklisted(true);
                }
            }).catch((error) => {
            console.log(error);
            if (error.response) {
                console.log(error.response.data.message);
                console.log(error.response.status);
            }
        })
    }

    return (
        // showRow ?
        <>
            <tr>
                <td style={descriptionStyle}>{props.index+1}</td>
                {/*<td style={descriptionStyle}>{props.suborg._id}</td>*/}
                <td style={descriptionStyle}>{props.suborg.name}</td>
                <td style={descriptionStyle}>{props.suborg.email}</td>
                <td style={descriptionStyle}>{props.suborg.numberOfURLs}</td>
                <td style={descriptionStyle}>{props.suborg.description}</td>
                { isBlacklisted ?
                    <td style={whiteStyle} onClick={whiteList}>Whitelist</td> :
                    <td style={deleteStyle} onClick={blackList}>Blacklist</td>
                }
            </tr>

        </>
    );
}

export default AdminSuborgRow;

