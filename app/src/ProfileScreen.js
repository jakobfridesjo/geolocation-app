import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import AlertCpn from "./components/Alert";

const restAPI = require('./restAPI');
const win = Dimensions.get("window");

const onConfirmLogout = () => {
	console.log("logout pressed");
};

const onPressLogout = () => {
	AlertCpn(
		"Log out",
		"Do you really want to log out ?",
		"validate",
		"cancel",
		onConfirmLogout
	);
};

const onConfirmDelete = () => {
	console.log("delete pressed");
};

const onPressDelete = () => {
	AlertCpn(
		"Delete account",
		"Do you really want to delete your account ?",
		"validate",
		"cancel",
		onConfirmDelete
	);
};



const ProfileScreen = ({ navigation }) => {
	const [name, setName] = useState("Name");
	const [age, setAge] = useState("20");
	const [mail, setMail] = useState("name@umu.se");
	const [id, setId] = useState("5");

	const getUserData = async () => {
		const data = await restAPI.getUserData();
		setName(data["name"]);
		setAge(data["age"]);
		setMail(data["mail"]);
		setId(data["id"]);
	}

	useEffect(() => {
		getUserData();
	},[]);

	console.log(id);
	return (
		<View style={styles.mainView}>
			<View style={styles.mainContainer}>
				<View style={styles.contentContainer}>
					<Image source={assets.user} style={styles.icon} />
					<View>
						<Text style={styles.text}>{name}</Text>
						<Text style={styles.text}>{age} year old</Text>
					</View>
				</View>
				<View style={styles.contentContainer}>
					<Image source={assets.mail} style={styles.icon} />
					<Text style={styles.text}>{mail}</Text>
				</View>
				{/*<View style={styles.qrContainer}>*/}
				{/*	<QrCpn*/}
				{/*		value={id}*/}
				{/*	/>*/}
				{/*</View>*/}
				{/*<View styles={styles.contentContainer}>*/}
				{/*	<Text style={styles.idText}>{id}</Text>*/}
				{/*</View>*/}
			</View>
			<TouchableOpacity style={[styles.contentContainer, styles.button, styles.orangeButton]} onPress={onPressLogout}>
				<Image source={assets.exit} style={styles.icon} />
				<Text style={styles.text}>Log out</Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.contentContainer, styles.button, styles.redButton]} onPress={onPressDelete}>
				<Image source={assets.delete} style={styles.icon} />
				<Text style={styles.text}>Remove account</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	mainView: {
		padding: win.width / 15,
		flex: 1,
	},
	mainContainer: {
		flex: 1,
	},
	contentContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: win.height / 40,
	},
	qrContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		display: "flex",
		alignItems: "center",
		alignSelf: "center",
		padding: win.width / 25,
	},
	button: {
		padding: win.width / 30,
		borderRadius: 5,
		width: win.width * 0.8,
		alignSelf: "center",
	},
	orangeButton: {
		backgroundColor: "#ff8600",
	},
	redButton: {
		backgroundColor: "#ff0000",
	},
	text: {
		color: "#000",
		fontSize: 26,
		paddingLeft: win.width / 20,
	},
	idText: {
		textAlign: "center",
		color: "#000000",
		fontSize: 16,
		padding: 5,
	},
	icon: {
		height: win.width / 8,
		width: win.width / 8,
	},
});

export default ProfileScreen;
