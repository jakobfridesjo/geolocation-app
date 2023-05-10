import React from "react";
import { Alert } from "react-native";

const AlertCpn = ( title, message, textTrue, textFalse, onPressTrue, onPressFalse ) => {
	Alert.alert(
		title,
		message,
		[
			{ text: textFalse, onPress: onPressFalse, style: "cancel" },
			{ text: textTrue, onPress: onPressTrue },
		]
	);
};

export default AlertCpn;
