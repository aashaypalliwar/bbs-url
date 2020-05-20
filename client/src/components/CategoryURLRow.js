import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {categoryStyle, descriptionStyle, textStyle, deleteStyle, linkStyle} from "../containers/CategoryManager/CategoryStyles";
import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";
import PopUpAlert from "./PopUpAlert";
import { clone } from "ramda"

const CategoryURLRow = (props) => {
    const [ isLoading, setLoading ] = useState(false);
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

    let deleteHandler = () => {
        //console.log(props.urls);
        let urls = clone(props.urls);
        let id = props.url._id;
        //console.log("before req");
        setLoading(true);
        //console.log(`/api/user/url?suborg=${props.url._id}`);
        axios.delete(`/api/suborg/url?id=${props.url._id}&suborg=${props.category}`, { withCredentials: true} )
            .then((response) => {
                //console.log(response);
                if(response.status === 204){
                    // setShowRow(false);
                    // console.log("proceeding to delete");
                    // console.log(props.urls);
                    // console.log(urls);
                    // console.log(id);
                    let index = urls.findIndex((u) => {
                       return u._id === id;
                    });
                    //console.log(index);
                    urls.splice(index,1)
                    //console.log("printing categories after deletion");
                    //console.log(urls)
                    props.set({ URLInfo: urls });
                }
                // setLoading(false);
                setShowDelete(false);
            }).catch((error) => {
                //console.log(error);
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
                    errorMessage: "Something went wrong! \n" + error.message
                })
            }
            setLoading(false);
        })
    }

    return (
        // showRow ?
        <>
        <tr>
            <td style={descriptionStyle}>{props.index+1}</td>
            <td ><a href={props.url.originalURL} style={linkStyle} target="_blank">{props.url.originalURL}</a></td>
            <td ><a href={"/" + props.url.shortURLEndPoint} style={linkStyle} target="_blank">{'bbsurl.in/' + props.url.shortURLEndPoint}</a></td>
            <td style={descriptionStyle}>{props.url.hits}</td>
            <td style={descriptionStyle}>{(new Date(props.url.createdAt)).toDateString()}</td>
            <td style={deleteStyle} onClick={triggerDeleteModal}>Delete</td>
        </tr>
            {
                showDelete? <PopUpAlert
                    show={showDelete}
                    isLoading={isLoading}
                    handleClose={handleCloseDelete}
                    variant="danger"
                    fireFunction={deleteHandler}
                    buttonToTrigger="Delete"
                    heading={`Delete URL - bbsurl.in/${props.url.shortURLEndPoint}`}
                    body={ errorStatus.isError ? errorStatus.errorMessage : `Are you sure you want to delete this labelled URL?`}
                /> : null
            }

        </>
    );
}

export default CategoryURLRow;

