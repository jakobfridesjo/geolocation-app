import * as React from "react"; 
import { useState } from "react";
import {StyleSheet, Text, TouchableOpacity, View, Alert, TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";

const restAPI = require('./restAPI');

const CreateUserScreen = ({}) => {
    const navigation = useNavigation();
    const [mail, setmail] = useState('');
    const [password, setPassword] = useState('');



    async function onPressLogin() {
        const login = {mail, password};
        restAPI.loginUser(login);
        const userData = await restAPI.getUserData();
        if (userData == -1){
            Alert.alert(
                "Wrong login",
                "Try again",
                [
                    {text: "OK", onPress:() => console.log("OK pressed")}
                ]
            ); 
        } else {
            navigation.navigate("Trails");
        }
    };

    return (
        <View style={styles.inputView}>
            <Text style={styles.text}>Trail Tracker</Text>

           
            <TextInput style={styles.input}
                placeholder="mail"
                placeholderTextColor="#00000"
                onChangeText={(mail) => setmail(mail)}
                />
            <TextInput style={styles.input}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="#00000"
                onChangeText={(password) => setPassword(password)}
                />
            
            <TouchableOpacity style={styles.login} onPress={onPressLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

        </View>
    )
};


const styles = StyleSheet.create({
    inputView: {
        backgroundColor: '#7FC88A',
        alignItems: 'center',
        alignContent: 'space-between',
        width: '100%',
        height: '100%',
    },
    input:{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        margin: 3,
        height: 50,
        width: 200,
        textSize: 18,
        color: 'black',
    },
    text: {
        marginVertical: 100,
        fontSize: 66,
    },
    login: {
        backgroundColor: '#A3EEFE',
        margin: 20,
        padding: 5,
        height: 50,
        width: 180,
        alignItems: 'center',
        borderRadius: 10,
    },
    loginText: {
        fontSize: 30,
        color: 'white',
        alignSelf: 'center',
    },
});

export default CreateUserScreen;