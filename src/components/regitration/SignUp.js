import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { connect } from "react-redux";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
        creative blog 
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUp(props) {

  const { logout } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openR, setOpenR] = React.useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userExist, setUserExist] = useState("");
  const [regSuccess, setRegSuccess] = useState("");



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setOpenR(false);
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    window.localStorage.clear();

    //Register
    axios
      .post("http://127.0.0.1:8000/blog/register/", {
        username: userName,
        password: password,
      })
      .then((res) => {
        // console.log(res.data, "signin page");
        const { username, password } = res.data;
        setRegSuccess("Registration successful, Please sign in after few seconds")
        setOpenR(!openR)
      })
      .catch((err) => {
        // Error

        const myError = err.response.data.username;
        setUserExist(myError[0])
        setOpen(!open)

      });
  };

  useEffect(() => {
    logout();
  }, []);

  if (regSuccess) return <Redirect to = "/login"/>
  return (
<Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
            <Snackbar open={openR} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            {regSuccess}
          </Alert>
        </Snackbar>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {userExist}
          </Alert>
        </Snackbar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="uname"
                onChange={(evt) => setUserName(evt.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(evt) => setPassword(evt.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="login/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  
  );
}

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = (dispatch) => ({
  authSuccess: (auth) => dispatch({ type: "AUTH_SUCCESS", payload: auth }),
  logout: () => dispatch({ type: "LOG_OUT" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
