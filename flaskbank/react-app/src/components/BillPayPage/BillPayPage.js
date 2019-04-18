import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Navigation from "../FrameWorkUnity/DynamicNavBar";
import Search from "../FrameWorkUnity/Search";
import Container from "../FrameWorkUnity/Container";
import InnerNavigationBar from "../FrameWorkUnity/StaticNavBar"
import {connect} from "react-redux";
import axios from "axios";
import { getProfile } from "../../actions/GetProfileAction/getProfileAction";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit * 3,
        width: 'auto',
    },
    root: {
        width: '100%',
    },
    paper: {
        position: 'flex',
        font: 'Helvetica',
        width: '100%',
        height: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        textAlign: 'center',
        WebkitBorderRadius:'10px 10px 10px 10px',
    },
});

class BillPay extends React.Component{
    state = {
        payAmountCredit: " ",
        creditAccountNumber: "",
        availableCredit :"",
        currentBalance:"",
        creditLimit:"",
    };

    componentDidMount() {
        this.setState({creditAccountNumber:  this.props.myInfo.accounts[2].account_number});
        this.setState({currentBalance:  this.props.myInfo.accounts[2].balance});
        this.setState({availableCredit:  this.props.myInfo.accounts[2].available_credit});
        this.setState({creditLimit:  this.props.myInfo.accounts[2].credit_limit});
    }


    onSubmit =(e) => {
        e.preventDefault();

        console.log('it just submit');
        console.log(this.props);

        if(this.state.payAmountCredit === 0) {
            alert("Bill Pay Amount Can't be 0, try again");
            return
        }

        const req_headers = {Authorization: 'Bearer ' + this.props.myKey}

        axios.post('/api/deposit',
            {amount: parseFloat(this.state.payAmountCredit),
                account_num: this.state.creditAccountNumber},
            {headers: req_headers}
        )
            .then(response => {
                console.log(response);
                alert("Bill Pay Success")

                axios.get("/api/client/all",{headers: req_headers})
                    .then(response => {
                        console.log(response);
                        this.props.getProfile(response.data);
                    }).catch (error => console.log(error.response.data.msg));


            }).catch (error => {
                console.log(error.response.data.msg);
               alert("Bill Pay Fail");
            });


        this.setState({payAmountCredit:  "$ Please Enter Your Amount"});
    }


    render() {

        const {classes} = this.props;
        return (
            <div >
                <Navigation/>
                <Search/>
                <Container >
                    <form onSubmit={this.onSubmit}>
                        <InnerNavigationBar active={activeElement}/>
                        <div className={classes.paper}>
                            <div style={{float: 'left', width:"30%"}}>
                                <Typography variant="h4" color= "secondary"><strong>SJSP Credit Card</strong></Typography>
                                <Typography variant="h6">SJSP Platinum Visa Card: </Typography> <Typography variant="subtitle1">${this.props.myInfo.accounts[2].account_number}</Typography>
                                <Typography variant="h6">Current Balance: </Typography><Typography variant="subtitle1">${this.props.myInfo.accounts[2].balance}</Typography>
                                <Typography variant="h6">Credit Limit: </Typography> <Typography variant="subtitle1">${this.props.myInfo.accounts[2].credit_limit}</Typography>
                                <Typography variant="h6">Available Credit: </Typography> <Typography variant="subtitle1">${this.props.myInfo.accounts[2].available_credit}</Typography>
                            </div>
                            <div style={{float: 'right', width:"30%"}}>
                                <Typography variant="h5"><strong>Amount</strong></Typography>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="amount"
                                    step="0.01"
                                    placeholder= "$ Please Enter Your Amount"
                                    value = {this.state.payAmountCredit}
                                    onChange ={e=>this.setState({payAmountCredit:e.target.value})}
                                />
                                <Button
                                    type = "submit"
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </form>
                </Container>
            </div>

        );
    }
}

const activeElement = {
    act1: "nav-link ",
    act2: "nav-link active",
    act3: "nav-link ",
    act4: "nav-link ",
}

const checkingContainerStyle = {
    height: '100%',
    width:  '100%',
    textAlign:'center',
    margin: 'auto',
    WebkitBorderRadius:'10px 10px 10px 10px',
    fontWeight: 'bold',
    font: 'Helvetica',
}


BillPay.propTypes = {
    classes: PropTypes.object.isRequired,
};



const mapStateToProps = (state) => {
    console.log("I'm in map State to Props");
    console.log(state);
    return state;
}


export default connect(mapStateToProps,{getProfile})(withStyles(styles)(BillPay));
