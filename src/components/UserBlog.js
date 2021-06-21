import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ModalForm from './ModalForm'



const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

function UserBlog(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    const { authSuccess } = props;

    const [blogData, setBlogData] = useState([]);
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        if (authSuccess === null) {
            props.history.push("/login");
        }

        if (authSuccess) {
            const authSuccess = localStorage.getItem("tokenId");
            const { user_id } = jwt_decode(authSuccess);
            console.log(jwt_decode(authSuccess))
            setUserId(user_id);
            axios
                .get(`http://127.0.0.1:8000/blog/userblogs/${user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${authSuccess}`,
                    },
                })
                .then(
                    (res) => {
                        const arr = res.data;
                        const newArray = arr.map((item) => {
                            return { ...item, modalFlag: false };
                        });


                        setBlogData(newArray);
                    },
                    (error) => {
                        // console.log(error);
                        // window.location.reload();
                        props.history.push("/login");
                    }
                );
        }
    }, [authSuccess]);

    //  
    const handleClose = (ind) => {
        const newArray = [
            ...blogData.slice(0, ind),
            { ...blogData[ind], modalFlag: !blogData[ind].modalFlag },
            ...blogData.slice(ind + 1),
        ];

        setBlogData(newArray);
    };

    const handleModalFlag = (ind) => {
        const newArray = [
            ...blogData.slice(0, ind),
            { ...blogData[ind], modalFlag: !blogData[ind].modalFlag },
            ...blogData.slice(ind + 1),
        ];

        setBlogData(newArray);
    };


    const handleDelete = (blogId) => {
        if (authSuccess) {
            const config = {
                headers: {
                    Authorization: `Bearer ${authSuccess}`,
                },
            };

            axios
                .delete(`http://127.0.0.1:8000/blog/post/${blogId}/`, config)
                .then(
                    (res) => {
                        // console.log(res.data)

                        window.location.reload();
                    },
                    (error) => {
                        // console.log(error);
                        window.location.reload();
                        // props.history.push("/login");
                    }
                );
        }
    };
    console.log(blogData)

    return (
        <div>
            {blogData.map((item, index) => {
                return (
                    <div key={item.id}>
                        <Accordion expanded={expanded === item.id} onChange={handleChange(item.id)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography className={classes.heading}>{item.title}</Typography>
                                <Typography className={classes.secondaryHeading}>{item.date_created}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <div dangerouslySetInnerHTML={{ __html: item.content }} ></div>
                                </Typography>
                                
                            </AccordionDetails>
                            {userId === item.author_id ? (
                                    <div className={classes.root}>
                                        <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                handleModalFlag(index);
                                            }}
                                        >
                                            <EditIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                handleDelete(item.id);
                                            }}
                                        >

                                            <DeleteIcon />
                                        </Button>
                                        </div>
                                        {item.modalFlag && (
                                            <ModalForm
                                                open={item.modalFlag}
                                                handleClose={handleClose}
                                                heading={item.title}
                                                content={item.content}
                                                blogId={item.id}
                                                userId={item.author_id}
                                                excerpt={item.excerpt}
                                                ind={index}
                                            />
                                        )}
                                    </div>
                                ) : null}
                        </Accordion>
                    </div>
                )
            })}
        </div>
    );
}

const mapStateToProps = (state) => ({
    authSuccess: state.authentication.tokenId,
});

export default connect(mapStateToProps)(UserBlog);
