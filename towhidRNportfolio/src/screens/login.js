import { Spinner } from 'native-base';
import React, { Component } from 'react'
import { Button, Text } from 'react-native'
import { GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';


export default class loginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            isDataLoaded: false,
            unsubscribe: function(){} 
        }
    }
    componentDidMount(){
        GoogleSignin.configure({
            webClientId: '365493099263-9iugvkp364ii5h5gob2ub555j1ditjc2.apps.googleusercontent.com',
            // 365493099263-9iugvkp364ii5h5gob2ub555j1ditjc2.apps.googleusercontent.com
        })

        // auth().signOut().catch(err=>{
        //     console.log(err.code);
        //     this.props.navigation.navigate('Login');
        // });
        
        const unsubscribe = auth().onAuthStateChanged(user=>{
            if(user){
                console.log("user from component did mount",user);
                this.props.navigation.navigate('Home');
                alert("User is logged in, calling from component did mount");
            }else{
                console.log("no user logged in");
                // this.props.navigation.navigate('Login');
                alert("User is not logged in, calling from component did mount");

            }
        });

        
        

        this.setState({
            isDataLoaded: !this.state.isDataLoaded,
            unsubscribe: unsubscribe
        })

    }

    componentWillUnmount(){
        // console.log("component will unmount triggers");
        let unsubscribe = this.state.unsubscribe;
        unsubscribe();
    }

    async loginGoogle(){
        let unsubscribe = this.state.unsubscribe;
        unsubscribe();
        try{
            // Get the users ID token
            let userInfo = await GoogleSignin.signIn();
            console.log('USER INFO: ', userInfo);
            alert("userinfo found on login google function");

            const {idToken} = userInfo;

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            

            // Sign-in the user with the credential
            auth().signInWithCredential(googleCredential).then((result)=>{
                let isNewUser = result.additionalUserInfo.isNewUser;
                
                // resubscribe
                const unsubscribe_ = auth().onAuthStateChanged(user=>{
                    if(user){
                        console.log("user== after resubscribe",user);
                        this.props.navigation.navigate('Home');
                        alert("resubscribed and found the user on login google function");

                    }else{
                        console.log("no user logged in");
                        alert("resubscribed and no user found on login google function");

                    }
                });

                this.setState({
                    unsubscribe: unsubscribe_
                })
            })

        }catch(error){
            console.log(error)
        }
    
    }

    render() {
        if(this.state.isDataLoaded){
            return (
                <>
                    <Button title="Login Google" onPress={()=>{

                      this.loginGoogle().then(()=>{
                          console.log("Logged in");
                      }).catch(err=>{
                          console.log(err)
                      });
                        
                    }
                    }/>
                </>
            )
        }else{
            return (
                <>
                    <Spinner />
                    <Spinner color='red' />
                    <Spinner color='green' />
                    <Spinner color='blue' />
                </>
            )
        }
    }
}
