import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {categoryStyle, whiteStyle, descriptionStyle, textStyle, deleteStyle, linkStyle} from "../containers/Admin/AdminStyles";
import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";
import PopUpAlert from "./PopUpAlert";
import { clone } from "ramda"

const AdminURLRow = (props) => {
    const [ isLoading, setLoading ] = useState(false);
    const [ isBlacklisted, setBlacklisted ] = useState(props.url.blacklisted);
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
        console.log(props.urls);
        let urls = clone(props.urls);
        let id = props.url._id;
        console.log("before req");
        setLoading(true);
        axios.put(`/api/admin/url`, { blacklisted: 0, _id: id },{ withCredentials: true } )
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
        console.log(props.urls);
        let urls = clone(props.urls);
        let id = props.url._id;
        console.log("before req");
        setLoading(true);
        axios.put(`/api/admin/url`, { blacklisted: 1, _id: id },{ withCredentials: true } )
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
            <td ><a href={props.url.originalURL} style={linkStyle} target="_blank">{props.url.originalURL}</a></td>
            <td ><a href={"/" + props.url.shortURLEndPoint} style={linkStyle} target="_blank">{'bbsurl.in/' + props.url.shortURLEndPoint}</a></td>
            <td style={descriptionStyle}>{props.url.email}</td>
            <td style={descriptionStyle}>{props.url.hits}</td>
            <td style={descriptionStyle}>{(new Date(props.url.createdAt)).toDateString()}</td>
            { isBlacklisted ?
                <td style={whiteStyle} onClick={whiteList}>Whitelist</td> :
                <td style={deleteStyle} onClick={blackList}>Blacklist</td>
            }
        </tr>

        </>
    );
}

export default AdminURLRow;

