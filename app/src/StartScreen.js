import * as React from "react"; 
import {StyleSheet, Text, TouchableOpacity, View, Alert, TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";

const restAPI = require('./restAPI');

const StartScreen = ({}) => {
    const navigation = useNavigation();
    const onPressLogin = () => {
        navigation.navigate("Login");
    };
    const onPressCreate = () => {
        navigation.navigate("CreateUser");
    };

    return (
        <View style={styles.inputView}>
            <Text style={styles.text}>Trail Tracker</Text>

            <TouchableOpacity style={styles.login} onPress={onPressLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.login} onPress={onPressCreate}>
                <Text style={styles.loginText}>Create User</Text>
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

export default StartScreen;