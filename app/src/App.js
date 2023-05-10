import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrailsScreen from "./TrailsScreen";
import HistoryScreen from "./HistoryScreen";
import FriendsScreen from "./FriendsScreen";
import ProfileScreen from "./ProfileScreen";
import StartScreen from "./StartScreen";
import LoginScreen from "./LoginScreen";
import CreateUserScreen from "./CreateUserScreen";
import FriendHistoryScreen from "./FriendHistoryScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const Login = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Start" component={StartScreen} options={{headerShown: false}}/>
            <Stack.Screen name="CreateUser" component={CreateUserScreen} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

const Friends = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Friends Home" component={FriendsScreen} />
            <Stack.Screen name="Friend History" component={FriendHistoryScreen} />
        </Stack.Navigator>
    )
}

const App = () => {
    return (

        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Login} options={{headerShown: false}} />
                <Drawer.Screen name="Trails" component={TrailsScreen} />
                <Drawer.Screen name="History" component={HistoryScreen} />
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Friends" component={Friends} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default App;
