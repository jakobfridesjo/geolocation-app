import * as React from "react";
import { Dimensions, FlatList, Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { formatMillisToTime, formatTimestamp } from "./utils";
import RouteDisplay from "./RouteDisplay";
import { useIsFocused } from "@react-navigation/native";

const win = Dimensions.get("window");
const restAPI = require('./restAPI');

const Item = ({ id, start_time, end_time }) => {
	const [coords, setCoords] = useState([]);
	let latitudeArray, longitudeArray;
	const time = formatMillisToTime(end_time - start_time);

	useEffect(() => {
		restAPI.getCoords(id)
			.then(response => {
				return response.json();
			})
			.then(data => {
				const coords = Object.values(data)[0];
				setCoords(coords);
			})
			.catch(error => {
				console.log("error: ", error);
			});
		console.log(id);
	}, []);
	latitudeArray = coords.map((item) => {return item['latitude']});
	longitudeArray = coords.map((item) => {return item['longitude']});

	return (
		<View style={styles.itemView}>
			<View style={styles.map}>
				<RouteDisplay latitudeArray = {latitudeArray} longitudeArray = {longitudeArray}></RouteDisplay>
			</View>
			<Text>Duration : {time.h>10 ? time.h : "0"+time.h}:{time.m>10 ? time.m : "0"+time.m}:{time.s>10 ? time.s : "0"+time.s}</Text>
			<Text>From : {start_time.toLocaleString()}</Text>
			<Text>To : {end_time.toLocaleString()}</Text>
		</View>
	);
};

const HistoryScreen = ({ navigation }) => {
	const [trails, setTrails] = useState([]);
	const [id, setId] = useState("");
	const isFocused = useIsFocused();

	const getUserData = async () => {
		const data = await restAPI.getUserData();
		setId(data["id"]);
	}

	useEffect(() => {
		getUserData();
		restAPI.getTrails(id)
			.then(response => {
				return response.json();
			})
			.then(data => {
				const trails = Object.values(data)[0];
				setTrails(trails);
			})
			.catch(error => {
				console.log("error: ", error);
			});
	}, [isFocused,id]);
	console.log(trails);

	const renderItem = ({ item }) => (
		<Item id={item.id} start_time={formatTimestamp(item.start_time)} end_time={formatTimestamp(item.end_time)} />
	);

	return (
		<View style={styles.mainView}>
			<FlatList
				data={trails}
				renderItem={renderItem}
				keyExtractor={item => item.id}
				initialNumToRender={50}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	mainView: {
		padding: win.width / 15,
	},
	itemView: {
		borderRadius: 5,
		backgroundColor: "#d0d0d0",
		padding: 20,
		marginBottom: 20,
	},
	map: {
		height: win.height*0.4,
	}
});

export default HistoryScreen;
