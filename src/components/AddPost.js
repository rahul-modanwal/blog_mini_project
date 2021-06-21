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
import jwt_decode from "jwt-decode";
import { Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html';

function AddPost(props) {
  console.log(props)
  const { open, handleClose, authSuccess, handleCloseAddPost } = props;
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState({editorState: EditorState.createEmpty()});


  const onEditorStateChange = (editorState) =>{
    setBlogContent({editorState})
  }
  // console.log(blogContent)

  const handlePost = (e) => {
    e.preventDefault();

    if (authSuccess) {
      const { user_id } = jwt_decode(authSuccess);

      const config = {
        headers: {
          Authorization: `Bearer ${authSuccess}`,
        },
      };

      const data = {
        content: draftToHtml(convertToRaw(blogContent.editorState.getCurrentContent())),
        title: blogTitle,
        user_id: user_id,
      };



      axios
        .post(`http://127.0.0.1:8000/blog/posts/`, data, config)
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

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleCloseAddPost()}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth='lg'
      >
        <DialogTitle id="form-dialog-title">NEW POST</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Blog Title"
            type="text"
            value={blogTitle}
            fullWidth
            onChange={(evt) => {
              setBlogTitle(evt.target.value);
            }}
          />

          <Box m={3} />
        
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
            placeholder="Enter blog content"
            value={blogContent}
            onChange={(evt) => {
              setBlogContent(evt.target.value);
            }}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseAddPost()} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePost} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authSuccess: state.authentication.tokenId,
});

export default connect(mapStateToProps)(AddPost);


