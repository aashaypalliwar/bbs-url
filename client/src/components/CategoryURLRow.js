import {descriptionStyle, deleteStyle, linkStyle} from "../containers/CategoryManager/CategoryStyles";
import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
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

    let triggerDeleteModal = () => {
        setShowDelete(true);
    }

    let deleteHandler = () => {
        let urls = clone(props.urls);
        let id = props.url._id;
        setLoading(true);
        axios.delete(`/api/suborg/url?id=${props.url._id}&suborg=${props.category}`, { withCredentials: true} )
            .then((response) => {
                if(response.status === 204){
                    let index = urls.findIndex((u) => {
                       return u._id === id;
                    });
                    urls.splice(index,1)
                    props.set({ URLInfo: urls });
                }
                setShowDelete(false);
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
                    errorMessage: "Something went wrong! \n" + error.message
                })
            }
            setLoading(false);
        })
    }

    return (
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