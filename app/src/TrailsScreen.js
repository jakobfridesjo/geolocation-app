import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions} from "react-native";
import {Stopwatch} from "react-native-stopwatch-timer";
import Toast from "./components/Toast";
import {useEffect} from "react";
import {formatStringToTime} from "./utils";
import RouteDisplay from "./RouteDisplay";


import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import moment from 'moment';

const restAPI = require('./restAPI')
const win = Dimensions.get("window");

const LOCATION_TRACKING = 'location-tracking';
var firstRead = 0;
var user_id;

var latitudeArray = [];
var longitudeArray = [];
var currRead = 0;


const TrailsScreen = ({ navigation }) => {

    const green = "#7fc88a";
    const red = "#d54651";
    const [messageButton, onChangeMessageButton] = React.useState("Start");
    const [colorButton, onChangeColorButton] = React.useState(green);
    const [isStopwatchRunning, setStopwatchRunning] = React.useState(false);
    const [isStopwatchReset, setStopwatchReset] = React.useState(true);
    const [isVisibleToast, setVisibleToast] = React.useState(false);
    const [time, setTime] = React.useState(0);

    const [locationStarted, setLocationStarted] = React.useState(false);
    const [done, setDone] = React.useState(false);

    const getUserID = async() => {
        const userData = await restAPI.getUserData();
        if (userData == -1){
            user_id = 4
        } else {
            user_id = userData.id
        }
    }

    useEffect(() => {
        getUserID();
        setVisibleToast(false);
        setStopwatchReset(false);

        config();

    }, [isVisibleToast, isStopwatchReset]);

    const config = async () => {
        let resf = await Location.requestForegroundPermissionsAsync();
        let resb = await Location.requestBackgroundPermissionsAsync();
        if (resf.status != 'granted' && resb.status !== 'granted') {
            console.log('Permission to access location was denied');
        } else {
            console.log('Permission to access location granted');
        }

        let gpsStatus = await Location.hasServicesEnabledAsync();
        if(!gpsStatus) {
            Alert.alert("TURN ON THE GPS");
        }
    };

    const getTime = (t) => {
        setTime(formatStringToTime(t));
    };

    const saveRecord = () => {
        if (time < 10) {
            setVisibleToast(true);
        }
    };

    const onPressTracking = async () => {
        let gpsStatus = await Location.hasServicesEnabledAsync();
        if (gpsStatus) {
            locationStarted ? stopLocation() : startLocationTracking();
            messageButton === "Stop" && saveRecord();
            messageButton === "Start" && setStopwatchReset(true);
            onChangeMessageButton(messageButton==="Start" ? "Stop" : "Start");
            onChangeColorButton(colorButton === green ? red : green);
            toggleIsRunning();
        } else {
            Alert.alert("Turn on the GPS before pressing 'Start Tracking'");
        }
    };

    const toggleIsRunning = () => {
        setStopwatchRunning(current => !current);
    };

    const startLocationTracking = async () => {
        await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 0,
        });
        if (firstRead == 0) {
            currRead = 0;
            latitudeArray = [];
            longitudeArray = [];
            firstRead = 1;

            restAPI.createTrail(user_id);
        }

        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TRACKING
            );

            setLocationStarted(hasStarted);
            setDone(false);
        };

        const stopLocation = () => {
            firstRead = 0;

            restAPI.updateTrail(user_id);

            setLocationStarted(false);
            setDone(true);

            TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING)
                .then((tracking) => {
                    if (tracking) {
                        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
                    }
                })
        }

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: '#efefef',
            }}>
            <Toast visible={isVisibleToast} message={"This trail is too short to be recorded !"}/>
            <Stopwatch
                start={isStopwatchRunning}
                reset={isStopwatchReset}
                options={styles.timer}
                getTime={getTime}
            />
            <View style={styles.map}>
                {done && latitudeArray.length > 0 &&
                    <RouteDisplay latitudeArray = {latitudeArray} longitudeArray = {longitudeArray}></RouteDisplay>
                }
            </View>
            <TouchableOpacity
                style={{
                    backgroundColor: colorButton,
                    borderRadius: 5,
                    width: '80%',
                    margin: 40,
                    position: 'absolute',
                    bottom: 0,
                }}
                onPress={onPressTracking}
            >
                <View style={{justifyContent: 'center', height: 120}}>
                    <Text style={{fontSize: 42, textAlign: 'center'}}>
                        {messageButton}{"\n"}
                        tracking
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    timer: {
        container: {
            backgroundColor: '#efefef',
            paddingVertical: 20,
            width: '100%',
            alignItems: 'center',
        },
        text: {
            fontSize: 50,
            color: '#000000',
            marginLeft: 7,
        },
    },
    map: {
        height: win.height*0.6,
        width: win.width*0.9,
    },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
        console.log('LOCATION_TRACKING task ERROR:', error);
        return;
    }
    if (data) {
        const { locations } = data;
        let latitude = locations[0].coords.latitude;
        let longitude = locations[0].coords.longitude;

        latitudeArray[currRead] = latitude;
        longitudeArray[currRead] = longitude;
        currRead++;

        const timecode = moment().format();
        const param = {longitude, latitude, timecode};

        restAPI.createCoords(param);
    }
})

export default TrailsScreen;
