import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import Footer from './Footer'

const useStyles = makeStyles({
    root:{
        maxWidth:340,
        margin:50,
    },
  card: {
      
      // marginLeft:'0px',
      
      marginTop:'50px'
      

  }
});



function Home(props) {
    console.log(props)
  
  const classes = useStyles();
 

  const [blog , setBlog] = useState([])

  const  userName  = props.userName
  const { authSuccess } = props;


  const [userId, setUserId] = useState(null);



  useEffect(() => {
    if (authSuccess === null) {
      props.history.push("/login");
    }

    if (authSuccess) {
      const authSuccess = localStorage.getItem("tokenId");
      const { user_id } = jwt_decode(authSuccess);
      setUserId(user_id);
      axios.get("http://127.0.0.1:8000/blog/posts/", {
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

            setBlog(newArray);
          },
          (error) => {
            props.history.push("/login");
          }
        );
    }
  }, [authSuccess]);
   console.log()  

  return (
      <div className="bg">
      
    <Grid container className={classes.card} alignItems = "center" direction="row" spacing={4} >{
        blog.map((blog) => (
        <Grid gutterBottom 
        key = {blog.id} spacing ={3} xs={12} md={4} >
          <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="140"
            image={`https://source.unsplash.com/collection/${blog.id *(Math.random(10000))}`}
          />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h3">
                {blog.title}
              </Typography>
              <br/>
              <div>{blog.month} {blog.day}</div>
              <Typography variant="body2" color="textSecondary">
                {blog.date_created}
              </Typography>
              <Typography variant='subtitle2'>
                Auther : <strong>{blog.author.toUpperCase()}</strong>
              </Typography>
              
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="success" >
              <Link to = {`/blog/${blog.id}`} >Read More</Link>
            </Button>
          </CardActions>
        </Card>
        </Grid>
      ))}
      </Grid>
      <Grid>
        <Footer/>
      </Grid>
      </div>
  )
}

const mapStateToProps = (state) => ({
  authSuccess: state.authentication.tokenId,
  userName: state.userData.userName
});

export default connect(mapStateToProps)(Home);
