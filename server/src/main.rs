#[macro_use]
extern crate rocket;

use model::*;
mod model;
use database::*;
mod database;

use rocket::fs::FileServer;
use rocket::serde::json::Json;
use rocket::{form::Form, response::Redirect};
use rocket_dyn_templates::Template;
use rocket::http::Status;

// WEB SECTION

/**
 * Renders the page for users
 */
#[get("/web/users")]
async fn web_users(conn: PsqlConn) -> Template {
    let mut vec_users: Vec<User> = conn.run(|c| db_select_users(c)).await.unwrap();
    vec_users.sort_by_key(|item| (item.id));
    vec_users.reverse();
    let context = UsersContext { users: vec_users };
    Template::render("users", &context)
}

/**
 * Renders the trails page
 */
#[get("/web/trails")]
async fn web_trails(conn: PsqlConn) -> Template {
    let mut vec_trails: Vec<Trail> = conn.run(|c| db_select_trails(c)).await.unwrap();
    vec_trails.sort_by_key(|item| (item.id));
    vec_trails.reverse();
    let context = TrailsContext { trails: vec_trails };
    Template::render("trails", &context)
}

/**
 * Renders a page with all the friend pairings
 */
#[get("/web/friends")]
async fn web_friends(conn: PsqlConn) -> Template {
    let mut vec_friends: Vec<Friend> = conn.run(|c| db_select_friends(c)).await.unwrap();
    vec_friends.sort_by_key(|item| (item.id));
    let context = WebFriendsContext { friends: vec_friends };
    Template::render("friends", &context)
}

/**
 * Adds a user
 */
#[post("/web/add/user", data = "<user>")]
async fn web_add_user(conn: PsqlConn, user: Form<UserAdd>) -> Redirect {
    let result = conn.run(|c| db_insert_user(c, user.into_inner())).await;
    if result.is_err() {
        println!("Error adding user");
    }
    Redirect::to(uri!(web_users))
}

/**
 * Deletes a user
 */
#[post("/web/del/user", data = "<id>")]
async fn web_del_user(conn: PsqlConn, id: Form<Id>) -> Redirect {
    let result = conn.run(|c| db_delete_user(c, id.into_inner())).await;
    if result.is_err() {
        println!("Error deleting user");
    }
    Redirect::to(uri!(web_users))
}

/**
 * Deletes a trail
 */
#[post("/web/del/trail", data = "<id>")]
async fn web_del_trail(conn: PsqlConn, id: Form<Id>) -> Redirect {
    let result = conn.run(|c| db_delete_trail(c, id.into_inner())).await;
    if result.is_err() {
        println!("Error deleting trail");
    }
    Redirect::to(uri!(web_trails))
}

/**
 * Adds a friend pairing
 */
#[post("/web/add/friend", data = "<friend>")]
async fn web_add_friend(conn: PsqlConn, friend: Form<Friend>) -> Redirect {
    let result = conn.run(|c| db_insert_friend(c, friend.into_inner())).await;
    if result.is_err() {
        println!("Error adding friend");
    }
    Redirect::to(uri!(web_friends))
}

/**
 * Deletes a friend pairing
 */
#[post("/web/del/friend", data = "<friend>")]
async fn web_del_friend(conn: PsqlConn, friend: Form<Friend>) -> Redirect {
    let result = conn.run(|c| db_delete_friend(c, friend.into_inner())).await;
    if result.is_err() {
        println!("Error deleting friend");
    }
    Redirect::to(uri!(web_friends))
}

// API SECTION

/**
 * Gets trails associated with a user id
 */
#[post("/api/trails", format = "json", data = "<id>")]
async fn api_trails(conn: PsqlConn, id: Json<Id>) -> Result<Json<TrailsContext>, Status> {
    let vec_trails = conn
        .run(|c| db_select_trails_id_user(c, id.into_inner()))
        .await;
    if vec_trails.is_ok() {
        let context = TrailsContext { trails: vec_trails.unwrap() };
        Ok(Json(context))
    } else {
        Err(Status::NotFound)
    }
}

/**
 * Gets coords associated with a trail id
 */
#[post("/api/coords", format = "json", data = "<id>")]
async fn api_coords(conn: PsqlConn, id: Json<Id>) -> Result<Json<CoordsContext>, Status> {
    let vec_coords = conn
        .run(|c| db_select_coords_id_trail(c, id.into_inner()))
        .await;
    if vec_coords.is_ok() {
        let context = CoordsContext { coords: vec_coords.unwrap() };
        Ok(Json(context))
    } else {
        Err(Status::NotFound)
    }
}



/**
 * Gets friends associated with a user id
 */
#[post("/api/friends", format = "json", data = "<id>")]
async fn api_friends(conn: PsqlConn, id: Json<Id>) -> Result<Json<ApiFriendsContext>, Status> {
    let vec_friends = conn
        .run(|c| db_select_friends_id_user(c, id.into_inner()))
        .await;
    if vec_friends.is_ok() {
        let context = ApiFriendsContext { friends: vec_friends.unwrap() };
        Ok(Json(context))
    } else {
        Err(Status::NotFound)
    }
}

/**
 * Adds a trail
 */
#[post("/api/add/trail", format = "json", data = "<trail>")]
async fn api_add_trail(conn: PsqlConn, trail: Json<TrailStart>) -> Result<Json<Id>, Status> {
    let vec_id = conn.run(|c| db_insert_trail(c, trail.into_inner())).await;
    if vec_id.is_ok() {
        Ok(Json(Id {id: vec_id.unwrap().first().unwrap().id}))
    } else {
        Err(Status::NotAcceptable)
    }
}

/**
 * Updates a trail
 */
#[post("/api/update/trail", format = "json", data = "<trail>")]
async fn api_update_trail(conn: PsqlConn, trail: Json<TrailEnd>) -> Result<Status, Status>{
    let result = conn.run(|c| db_update_trail(c, trail.into_inner())).await;
    if result.is_ok() {
        Ok(Status::Ok) 
    } else {
        Err(Status::NotFound)
    }
}

/**
 * Updates a user name
 */
#[post("/api/update/user/name", format = "json", data = "<user>")]
async fn api_update_user_name(conn: PsqlConn, user: Json<UserName>) -> Result<Status, Status> {
    let result = conn.run(|c| db_update_user_name(c, user.into_inner())).await;
    if result.is_ok() {
        Ok(Status::Ok)
    } else {
        Err(Status::NotAcceptable)
    }
}

/**
 * Updates a user mail
 */
#[post("/api/update/user/mail", format = "json", data = "<user>")]
async fn api_update_user_mail(conn: PsqlConn, user: Json<UserMail>) -> Result<Status, Status> {
    let result = conn.run(|c| db_update_user_mail(c, user.into_inner())).await;
    if result.is_ok() {
        Ok(Status::Ok)
    } else {
        Err(Status::NotAcceptable)
    }
}

/**
 * Updates a user password
 */
#[post("/api/update/user/password", format = "json", data = "<user>")]
async fn api_update_user_password(conn: PsqlConn, user: Json<UserPassword>) -> Result<Status, Status> {
    let result = conn.run(|c| db_update_user_password(c, user.into_inner())).await;
    if result.is_ok() {
        Ok(Status::Ok)
    } else {
        Err(Status::NotAcceptable)
    }
}

/**
 * Deletes a trail
 */
#[post("/api/del/trail", format = "json", data = "<id>")]
async fn api_del_trail(conn: PsqlConn, id: Json<Id>) -> Result<Status, Status> {
    let result = conn.run(|c| db_delete_trail(c, id.into_inner())).await;
    if result.is_ok() {
        Ok(Status::Ok)
    } else {
        Err(Status::NotFound)
    }
}

/**
 * Adds a coordinate
 */
#[post("/api/add/coord", format = "json", data = "<coord>")]
async fn api_add_coord(conn: PsqlConn, coord: Json<CoordAdd>) -> Result<Status, Status> {
    let result = conn.run(|c| db_insert_coord(c, coord.into_inner())).await;
    if result.is_ok() {
        Ok(Status::Ok)
    } else {
        Err(Status::NotAcceptable)
    }
}

/**
 * Adds a user
 */
#[post("/api/add/user", format = "json", data = "<user>")]
async fn api_add_user(conn: PsqlConn, user: Json<UserAdd>) -> Result<Json<Id>, Status> {
    let vec_id = conn
        .run(|c| db_insert_user(c, user.into_inner()))
        .await;
    if vec_id.is_ok() {
        Ok(Json(Id {id: vec_id.unwrap().first().unwrap().id}))
    } else {
        Err(Status::NotAcceptable)
    }
}

/**
 * Deletes a user
 */
#[post("/api/del/user", format = "json", data = "<id>")]
async fn api_del_user(conn: PsqlConn, id: Json<Id>) -> Result<Status, Status> {
    let result = conn.run(|c| db_delete_user(c, id.into_inner())).await;
    if result.is_ok() {
        Ok(Status::Ok)
    } else {
        Err(Status::NotFound)
    }
}

/**
 * Adds a friend
 */
#[post("/api/add/friend", format = "json", data = "<friend>")]
async fn api_friends_add(conn: PsqlConn, friend: Json<Friend>) -> Result<Status, Status>{
    let result = conn.run(|c| db_insert_friend(c, friend.into_inner())).await;
    if result.is_ok() {
        Err(Status::Ok)
    } else {
        Ok(Status::NotAcceptable)
    }
}

/**
 * Deletes a friend
 */
#[post("/api/del/friend", format = "json", data = "<friend>")]
async fn api_friends_del(conn: PsqlConn, friend: Json<Friend>) -> Result<Status, Status>{
    let result = conn.run(|c| db_delete_friend(c, friend.into_inner())).await;
    if result.is_ok() {
        Ok(Status::Ok)
    } else {
        Err(Status::NotFound)
    }
}

/**
 * Gives the information needed for a user when logging in
 */
#[post("/api/login", format = "json", data = "<login>")]
async fn api_login(conn: PsqlConn, login: Json<Login>) -> Result<Json<UserInfo>, Status> {
    let vec_ui = conn.run(|c| db_login(c, login.into_inner())).await;
    if vec_ui.is_ok() {
        let ui = vec_ui.unwrap();
        if ui[0].id == -1 {
            Err(Status::NotAcceptable)
        } else {
        Ok(Json(UserInfo {id: ui[0].id, name: ui[0].name.to_string(), age: ui[0].age, mail: ui[0].mail.to_string()}))
        }
    } else {
        Err(Status::NotAcceptable)
    }
}


/**
 * Renders the index page
 */
#[get("/")]
fn index() -> Template {
    Template::render(
        "index",
        IndexContext {
            bar: "Hello World!".to_string(),
        },
    )
}

#[launch]
fn rocket() -> _ {
    /* Launch rocket! */
    rocket::build()
        .mount("/", FileServer::from("static"))
        .mount(
            "/",
            routes![
                index,
                web_trails,
                web_users,
                web_friends,
                web_add_friend,
                web_del_friend,
                web_del_trail,
                web_add_user,
                web_del_user,
                api_login,
                api_add_user,
                api_del_user,
                api_update_user_name,
                api_update_user_mail,
                api_update_user_password,
                api_trails,
                api_add_trail,
                api_del_trail,
                api_update_trail,
                api_friends,
                api_friends_add,
                api_friends_del,
                api_coords,
                api_add_coord
            ],
        )
        .attach(Template::fairing())
        .attach(PsqlConn::fairing())
}
