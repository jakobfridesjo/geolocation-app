import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as React from "react";
import { useEffect } from "react";

const restAPI = require('./restAPI')
const win = Dimensions.get("window");

const FriendsScreen = ({ navigation }) => {
    const [id, setId] = React.useState("");
    const [friendsId, onChangeFriendsId] = React.useState("");
    const [friends, setFriends] = React.useState([]);

    const onPressFriendName = (id) => {
        navigation.navigate('Friend History',{friendId: id});
    };

    const Item = ({ id, name_friend }) => (
        <TouchableOpacity style={styles.friendsButton} onPress={() => onPressFriendName(id)}>
            <Text style={styles.text}>{name_friend}</Text>
        </TouchableOpacity>
    );

    const onPressAddFriends = (id,id_friend) => {
        restAPI.addFriend({id,id_friend});
        setFriends(friendsId);
    };

    const getUserData = async () => {
        const data = await restAPI.getUserData();
        setId(data["id"]);
    }

    useEffect(() => {
        getUserData();
        restAPI.getFriend(id)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setFriends(Object.values(data)[0]);
            })
            .catch(error => {
                console.log("error: ", error);
            });
    },[id]);

    console.log("test friends : ",friends);

    const renderItem = ({ item }) => (
        <Item id={item.id} name_friend={item.name_friend} />
    );
    return (
        <View style={styles.mainView}>
            <View style={styles.contentContainer}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangeFriendsId}
                    value={friendsId}
                    placeholder="Enter friend id"
                />
                <TouchableOpacity style={styles.button} onPress={() => onPressAddFriends(id,parseInt(friendsId,10))}>
                    <Text style={styles.text}>Add</Text>
                    <Text style={styles.text}>Friend</Text>
                </TouchableOpacity>
            </View>
            <FlatList data={friends} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    )
};

const styles = StyleSheet.create({
    mainView: {
        padding: win.width / 15,
        flex: 1,
    },
    textInput: {
        height: win.height/12,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 24,
        flex: 1,
        padding: 20,
        marginRight: 20,
    },
    contentContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    button: {
        borderRadius: 5,
        width: win.width * 0.3,
        alignSelf: "center",
        backgroundColor: "#7fc88a"
    },
    friendsButton: {
        borderRadius: 5,
        alignSelf: "stretch",
        backgroundColor: "#d0d0d0",
        padding: 20,
        marginBottom: 20,
    },
    text: {
        color: "#000",
        fontSize: 26,
        textAlign: "center",
    },
});

export default FriendsScreen;
