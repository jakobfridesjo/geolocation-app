import {StyleSheet, View, Alert} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

let minLat, maxLat, minLng, maxLng;

const RouteDisplay = (props) => {
    const coordinates = [];
    var { latitudeArray, longitudeArray } = props
    //latitudeArray = [63.8275207, 63.8268424, 63.8268329, 63.8269631];
    //longitudeArray = [20.2986002, 20.3004207, 20.3014614, 20.3016599];

    if (longitudeArray.length == 0) {
        Alert.alert("Unfortunately no coordinates where collected...");
        return;

    } else {
        maxLat = Math.max.apply(Math, latitudeArray);
        minLat = Math.min.apply(Math, latitudeArray);
        maxLng = Math.max.apply(Math, longitudeArray);
        minLng = Math.min.apply(Math, longitudeArray);

        let j = 0;
        for (let i = 0; i < latitudeArray.length; i++) {
            if(typeof(latitudeArray[i]) == "number" && typeof(longitudeArray[i]) == "number") {

                coordinates[j] = {
                latitude: latitudeArray[i],
                longitude: longitudeArray[i],
                }
                j++;
            }
        }
    }
    return (
        <View style={styles.container}>
            <MapView
                style={styles.maps}
                initialRegion={{
                    latitude: coordinates[0].latitude,
                    longitude: coordinates[0].longitude,
                    //latitudeDelta: (maxLat - minLat),
                    latitudeDelta: 0.00622,
                    //longitudeDelta: (maxLng - minLng),
                    longitudeDelta: 0.00121,
                }}
            >
                <Marker pinColor="green" coordinate={coordinates[0]} />
                <Marker coordinate={coordinates[coordinates.length - 1]} />
                <Polyline
                    coordinates={coordinates}
                    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeColors={["#7F0000"]}
                    strokeWidth={4}
                />
            </MapView>
        </View>
    );
};
export default RouteDisplay;

const styles = StyleSheet.create({
    container: {
        top:0
    },
    maps: {
        width: '100%',
        height: '100%',
    },
});
