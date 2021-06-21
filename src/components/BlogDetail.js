import { Grid, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/home.css'

const BlogDetail = (props) => {
    const [blog, setBlog] = useState({});
    useEffect(() => {

        const blogId = props.match.params.blogId
        console.log(props)
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/blog/post/${blogId}/`);
                setBlog(res.data);
                console.log(res.data)
            }
            catch (err) {

            }
        };
        fetchData();
    }, [])

    const createBlog = () => {
        return { __html: blog.content }
    };

    return (
        <main className="blog-detail" >
            <section>
               <h1 className="blog-detail-heading" > {blog.title} </h1> 
            </section>
            <section className="blog-detail-content" >
                <div dangerouslySetInnerHTML={createBlog()} ></div>
            </section>
            <section>
                <div>
                    <Link to='/home'>Back to Blogs</Link>
                </div>
            </section>
        </main>
    )
}

export default BlogDetail
