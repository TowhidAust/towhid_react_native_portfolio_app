import React, { Component } from 'react';
import { Button, Text } from 'react-native';
import auth from '@react-native-firebase/auth';


export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            isDataLoaded: false,
        }
    }
    componentDidMount(){

    }
    render() {
        return (
            <>
               <Button title="home"/>
               <Button title="logout" color="red" onPress= {()=> auth().signOut().then(()=>{
                   this.props.navigation.navigate('Login');
               }).catch(err=>{
                   console.log(err.code);
               })}/>
            </>
        )
    }
}
