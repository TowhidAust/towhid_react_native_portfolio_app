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
            }else{
                alert("no user logged in");
                // this.props.navigation.navigate('Login');

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
                    }else{
                        alert("no user logged in")
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
                    <Button title="Login With Google" onPress={()=>{

                      this.loginGoogle().then(()=>{
                          alert("Logged in");
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
