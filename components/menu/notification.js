import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client/dist/socket.io';
window.navigator.userAgent = 'react-native';
import PushController from './pushController';
import BackgroundTask from 'react-native-background-task';
import { ACCESS_TOKEN } from '../sign-in/sign-in'
var PushNotification = require('react-native-push-notification');
var moment = require('moment');

var {width, height} = Dimensions.get('window');
var vw = width/100
var vh = height/100
var msg = ''

BackgroundTask.define(() => {
    this.socket = io('http://socket-fp-soft-eng.herokuapp.com/', {jsonp: false});
  })

export default class Notification extends React.Component {

    constructor(){
        super();
        // this.socket = io('http://socket-fp-soft-eng.herokuapp.com/', {jsonp: false});
        this.state = {
            data: [],
            date: `${new Date().getFullYear() + '/' + new Date().getMonth()}`
        }
    }
    
    async componentDidMount(){
        //console.log(new Date())
        var token = await AsyncStorage.getItem(ACCESS_TOKEN)
        BackgroundTask.schedule()
        
        //console.log("notif")
        // this.socket.on("FromAPI", data => {
        //     alert(data.message)
        //     PushNotification.localNotification({
        //         message: data.message
        //     })
        // });

        axios.get('http://178.128.214.101:7000/home-security/image/warning',{
            params: {
                date: this.state.date
            },
            headers: {accessToken: token}
        }).then(res => {
            this.setState({
                data: res.data.data
            })
        }).catch((error) => {
            alert(error);
        });
        
    }

    render() {
        return(
            <View style={styles.mainMenu}>
                {
                    this.state.data.map((dat) => 
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('NotifDetails',{
                            id: dat.id
                        })}>
                            <Text style={styles.userName}>{dat.sensorsFeedback.message}</Text>
                            <Text style={styles.userMacAddress}>{dat.createdDate}</Text>                       
                        </TouchableOpacity>
                    )
                }
                <PushController/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainMenu: {
        paddingTop: 1*vh,
        minHeight: 300*vh,
        backgroundColor: '#181B23',
    },
    userName: {
        color: 'white',
        fontSize: 7*vw,
        fontWeight: 'bold',
        paddingTop: 2*vw
    },
    userMacAddress: {
        color: 'white',
        fontSize: 6*vw,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        paddingBottom: 2*vh
    },
});