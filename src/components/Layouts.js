import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Home from "./Home";
import SignUp from "./regitration/SignUp";
import SignIn from "./regitration/SignIn";
import UserBlog from "./UserBlog";
import BlogDetail from "./BlogDetail";

function Layouts(props) {

    useEffect(() => {
        props.authInitiate();
    }, []);

    return (
        <div>
            <Switch>
                <Route exact path="/" component={SignUp} />
                <Route exact path="/login" component={SignIn} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/userblogs" component={UserBlog} />
                <Route exact path="/blog/:blogId" component={BlogDetail} />
            </Switch>
        </div>
    );
}

const mapStateToProps = (state) => ({
    state,
});

const mapDispatchToProps = (dispatch) => ({
    authInitiate: () => dispatch({ type: "AUTH_INITIATE" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layouts);