import React, {Component} from 'react';
import Navigation from "../FrameWorkUnity/DynamicNavBar";
import Search from "../FrameWorkUnity/Search";
import Container from "../FrameWorkUnity/Container";
import axios from "axios";
import Paper from '@material-ui/core/Paper';
import {Redirect} from "react-router-dom";


const openAccountPage = () => {
    return (
        <div>
            <Navigation/>
            <Search/>
            <Container>
                <Register/>
            </Container>
        </div>
    );
}


class Register extends Component {

    state = {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        errors: {},
        flag: false,

    }

    onChange = (e) => {

        if(e.target.name==='first_name' ||e.target.name === 'last_name') {
            if (/^[a-zA-Z_\-\s]+$/.test(e.target.value) ) {
                this.setState({[e.target.name]: e.target.value});
            }
        }else {
            this.setState({[e.target.name]: e.target.value});
        }

    }


    onSubmit = (e) => {
        e.preventDefault();
        console.log("i just submit")


        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            alert('Invalid email format');
            return;
        }

        axios.post("/api/register", {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        })
            .then(response => {
                console.log(response);
                alert("New Account Successfully Created");
                this.setState({flag: true})
            })
            .catch(error => {
                console.log(error.response.data.msg)
                alert("Register Fail, Please Try Again---" + error.response.data.msg);
                //this.props.logInRequest(error.response)
            });
    };


    render() {

        if (this.state.flag == true) {
            return (<Redirect to={'/'}/>)
        }

        return (
            <Paper className="paper" style={paperStyle}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mt-5 mx-auto">
                            <form noValidate onSubmit={this.onSubmit}>
                                <h1 className="h3 mb-3 font-weight-bold f font-weight-normal">Open an Account</h1>
                                <div className="form-group">
                                    <label htmlFor="name">First Name:</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        name="first_name"
                                        placeholder="Enter Your First Name"
                                        maxlength="50"
                                        value={this.state.first_name}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Last Name:</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        name="last_name"
                                        placeholder="Enter Your Last Name"
                                        maxlength="50"
                                        value={this.state.last_name}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Username:</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Enter Your User Name"
                                        maxlength="50"
                                        value={this.state.username}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address:</label>
                                    <input
                                        required
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Enter an Email"
                                        maxlength="50"
                                        value={this.state.email}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        required
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Enter a Password"
                                        maxlength="50"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-lg btn-primary btn-block"
                                >
                                    Register!
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }
}

const paperStyle = {
    height: '100%',
    width: '100%',
    fontWeight: 'bold',
    WebkitBorderRadius: '10px 10px 10px 10px',
    textAlign: 'center',
    font: 'Helvetica',
    margin: 'auto',
};

export default openAccountPage;
