import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import axios from "axios";
import { Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';

function ModalForm(props) {
    console.log(props)
    const {
        open,
        handleClose,
        heading,
        content,
        blogId,
        userId,
        authSuccess,
        ind,
    } = props;
    const Textcontent = ContentState.createFromBlockArray(convertFromHTML(content));
    const [blogTitle, setBlogTitle] = useState(heading);
    const [blogContent, setBlogContent] = useState({editorState: EditorState.createWithContent(Textcontent)});

    const onEditorStateChange = (editorState) =>{
        setBlogContent({editorState})
      }

    const handlePost = (e) => {
        e.preventDefault();

        if (authSuccess) {
            const config = {
                headers: {
                    Authorization: `Bearer ${authSuccess}`,
                },
            };

            const data = {
                content: draftToHtml(convertToRaw(blogContent.editorState.getCurrentContent())),
                title: blogTitle,
                user_id: userId,
                id: blogId,
            };

            axios
                .put(`http://127.0.0.1:8000/blog/post/${blogId}/`, data, config)
                .then(
                    (res) => {
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

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => handleClose(ind)}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth='lg'
            >
                <DialogTitle id="form-dialog-title">EDIT POST</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edit your content here
          </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Blog Heading"
                        type="text"
                        value={blogTitle}
                        fullWidth
                        onChange={(evt) => {
                            setBlogTitle(evt.target.value);
                        }}
                    />

                    <Box m={4} />
                    <Editor
                        editorState={blogContent.editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChange}
                    />

                    {/* <TextareaAutosize
                        rowsMin={8}
                        rowsMax={10}
                        style={{ width: "100%" }}
                        variant="outlined"
                        aria-label="maximum height"
                        placeholder="Maximum 4 rows"
                        value={blogContent}
                        onChange={(evt) => {
                            setBlogContent(evt.target.value);
                        }}
                    /> */}



                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(ind)} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handlePost} color="primary">
                        SAVE
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const mapStateToProps = (state) => ({
    authSuccess: state.authentication.tokenId,
});

export default connect(mapStateToProps)(ModalForm);
