/**
 * Description: Defines structs for converting data between database and server
 *
 * Author: Jakob Fridesjö
 * Date: 2022-09-26
 */
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug)]
pub struct IndexContext<String> {
    pub bar: String,
}

#[derive(Serialize, Debug)]
pub struct UsersContext {
    pub users: Vec<User>,
}

#[derive(Serialize, Debug)]
pub struct WebFriendsContext {
    pub friends: Vec<Friend>,
}

#[derive(Serialize, Debug)]
pub struct ApiFriendsContext {
    pub friends: Vec<ApiFriend>,
}

#[derive(Serialize, Debug)]
pub struct TrailsContext {
    pub trails: Vec<Trail>,
}

#[derive(Serialize, Debug)]
pub struct CoordsContext {
    pub coords: Vec<Coord>,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub age: i32,
    pub mail: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct UserAdd {
    pub name: String,
    pub age: i32,
    pub mail: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct Trail {
    pub id: i32,
    pub id_user: i32,
    pub start_time: String,
    pub end_time: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct TrailStart {
    pub id: i32,
    pub start_time: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct TrailEnd {
    pub id: i32,
    pub end_time: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct ApiFriend {
    pub id: i32,
    pub name_friend: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct Friend {
    pub id: i32,
    pub id_friend: i32,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct Coord {
    pub id: i32,
    pub id_trail: i32,
    pub longitude: f64,
    pub latitude: f64,
    pub timecode: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct CoordAdd {
    pub id: i32,
    pub longitude: f64,
    pub latitude: f64,
    pub timecode: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct Id {
    pub id: i32,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct Login {
    pub mail: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct UserInfo {
    pub id: i32,
    pub name: String,
    pub age: i32,
    pub mail: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct UserName {
    pub id: i32,
    pub password: String,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct UserMail {
    pub id: i32,
    pub password: String,
    pub mail: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct UserPassword {
    pub id: i32,
    pub password: String,
    pub new_password: String,
}
