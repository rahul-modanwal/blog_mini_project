import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import axios from "axios";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddPost from "./AddPost";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Navbar(props) {
  const { authSuccess, logout,
     addUser, userName } = props;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openNewForm, setOpenNewForm] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddPost = () => {
    setOpenNewForm(!openNewForm);
  };

  const handleCloseAddPost = (ind) => {
    setOpenNewForm(!openNewForm);
  };

  useEffect(() => {
    if (authSuccess) {
      const { user_id } = jwt_decode(authSuccess);

      axios
        .get(`http://127.0.0.1:8000/blog/user/${user_id}/`, {
          headers: {
            Authorization: `Bearer ${authSuccess}`,
          },
        })
        .then(
          (res) => {
            const { username } = res.data;
            addUser([user_id, username]);
          },
          (error) => {
            window.location.reload();
            // props.history.push("/login");
          }
        );
    }
  }, [authSuccess]);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="success" >
        <Toolbar>
          

          {authSuccess && (
            <>
              <Typography variant="h6" className={classes.title}>
                <Link href="/home" color="inherit" variant="h6">
                  Home
                </Link>
              </Typography>
              <Typography variant="h6" className={classes.title}>
                <Link href="/userblogs" color="inherit" variant="h6">
                  dashboard
                </Link>
              </Typography>
              <Typography variant="h6" className={classes.title}>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleAddPost}
                  color="inherit"
                >
                  <AddCircleIcon fontSize="large" />
                </IconButton>
              </Typography>
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    {userName ? userName.toUpperCase() : null}
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link
                      href="/login"
                      color="inherit"
                      variant="subtitle2"
                      onClick={() => {
                        logout();
                      }}
                    >
                      LOGOUT
                    </Link>
                  </MenuItem>
                </Menu>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
      {openNewForm && <AddPost open={openNewForm} handleCloseAddPost={handleCloseAddPost}/>}
      <br/>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authSuccess: state.authentication.tokenId,
  userId: state.userData.userId,
  userName: state.userData.userName,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch({ type: "LOG_OUT" }),
  addUser: (val) => dispatch({ type: "ADD_USER", payload: val }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
