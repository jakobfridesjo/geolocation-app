/**
 * Description: To be used for communicating with postgresql
 *
 * Author: Jakob Fridesjö
 * Date: 2022-09-26
 */
use crate::model::*;
use postgres::error::Error;
use rocket_sync_db_pools::{database, postgres};

#[database("psql_pool")]
pub struct PsqlConn(postgres::Client);

/**
 * Inserts a user into the database
 */
pub fn db_insert_user(conn: &mut postgres::Client, user: UserAdd) -> Result<Vec<Id>, Error> {
    conn.execute(
        "
        INSERT INTO 
            users 
            (name, age, mail, pwd) 
        VALUES 
            ($1 ,$2, $3, $4)
        ",
        &[&user.name, &user.age, &user.mail, &user.password],
    )?;
    let mut vec_id: Vec<Id> = Vec::new();
    for row in conn.query(
        "
        SELECT 
            id 
        FROM 
            users 
        WHERE 
            (mail=$1 AND pwd=crypt($2, pwd))
        ", 
        &[&user.mail, &user.password]
    )? {
        vec_id.push(Id {
            id: row.get(0)
        });
    }
    Ok(vec_id)
}

/**
 * Inserts a friend pairing into the database
 */
pub fn db_insert_friend(conn: &mut postgres::Client, friend: Friend) -> Result<(), Error> {
    conn.execute(
        "
        INSERT INTO 
            friends
            (id_user, id_friend)
        VALUES
            ($1 ,$2)
        ",
        &[&friend.id, &friend.id_friend]
    )?;
    Ok(())
}

/**
 * Deletes a friend pairing from the database
 */
pub fn db_delete_friend(conn: &mut postgres::Client, friend: Friend) -> Result<(), Error> {
    conn.execute(
        "
        DELETE FROM 
            friends 
        WHERE
            id_user=$1
        AND
            id_friend=$2
        ",
        &[&friend.id, &friend.id_friend],
    )?;
    Ok(())
}

/**
 * Inserts a coordinate into the database
 */
pub fn db_insert_coord(conn: &mut postgres::Client, coord: CoordAdd) -> Result<(), Error> {
    conn.execute(
        "
        INSERT INTO 
            coords
            (id_trail, longitude, latitude, timecode) 
        VALUES 
            ($1 ,$2, $3, to_timestamp($4, 'YYYY-MM-DDThh24:mi:ssTZH:TZM'))
        ",
        &[&coord.id, &coord.longitude, &coord.latitude, &coord.timecode],
    )?;
    Ok(())
}

/**
 * Inserts a trail into the database
 */
pub fn db_insert_trail(conn: &mut postgres::Client, trail: TrailStart) -> Result<Vec<Id>, Error> {
    conn.execute(
        "
        INSERT INTO 
            trails 
            (start_time, id_user) 
        VALUES (
            to_timestamp($1, 'YYYY-MM-DDThh24:mi:ssTZH:TZM'), 
            $2
        )
        ",
        &[&trail.start_time, &trail.id]
    )?;
    
    // Get trail id
    let mut vec_id: Vec<Id> = Vec::new();
    for row in conn.query(
        "
        SELECT 
            id 
        FROM 
            trails 
        WHERE (
            id_user=$1 
            AND 
            start_time=to_timestamp($2, 'YYYY-MM-DDThh24:mi:ssTZH:TZM')
        )
        ", 
        &[&trail.id, &trail.start_time]
    )? {
        vec_id.push(Id {
            id: row.get(0)
        });
    }
    Ok(vec_id)
}

/*
    UPDATE FUNCTIONS
 */

/**
 * Updates a trail in the database
 */
pub fn db_update_trail(conn: &mut postgres::Client, trail: TrailEnd) -> Result<(), Error> {
    conn.execute(
        "
        UPDATE 
            trails 
        SET
            end_time=to_timestamp($2, 'YYYY-MM-DDThh24:mi:ssTZH:TZM') 
        WHERE 
            id=$1
        ",
        &[&trail.id, &trail.end_time]
    )?;
    Ok(())
}

/**
 * Updates a trail in the database
 */
pub fn db_update_user_name(conn: &mut postgres::Client, user: UserName) -> Result<(), Error> {
    conn.execute(
        "
        UPDATE 
            users 
        SET
            name=$3 
        WHERE 
            id=$1 AND pwd=crypt($2, pwd)
        ",
        &[&user.id, &user.password, &user.name]
    )?;
    Ok(())
}
/**
 * Updates a trail in the database
 */
pub fn db_update_user_mail(conn: &mut postgres::Client, user: UserMail) -> Result<(), Error> {
    conn.execute(
        "
        UPDATE 
            users 
        SET
            mail=$3
        WHERE 
            id=$1 AND pwd=crypt($2, pwd)
        ",
        &[&user.id, &user.password, &user.mail]
    )?;
    Ok(())
}
/**
 * Updates a trail in the database
 */
pub fn db_update_user_password(conn: &mut postgres::Client, user: UserPassword) -> Result<(), Error> {
    conn.execute(
        "
        UPDATE 
            users
        SET
            password=$3
        WHERE 
            id=$1 AND pwd=crypt($2, pwd)
        ",
        &[&user.id, &user.password, &user.new_password]
    )?;
    Ok(())
}
/*
    READ FUNCTIONS
*/

/**
 * Loads all users from the database
 */
pub fn db_select_users(conn: &mut postgres::Client) -> Result<Vec<User>, Error> {
    let mut vec_users: Vec<User> = Vec::new();
    for row in conn.query(
        "
        SELECT 
            id, name, age, mail, pwd 
        FROM 
            users
        ", 
        &[]
    )? {
        vec_users.push(User {
            id: row.get(0),
            name: row.get(1),
            age: row.get(2),
            mail: row.get(3),
            password: row.get(4),
        });
    }
    Ok(vec_users)
}

/**
 * Loads all trails from the database
 */
pub fn db_select_trails(conn: &mut postgres::Client) -> Result<Vec<Trail>, Error> {
    let mut vec_trails: Vec<Trail> = Vec::new();
    for row in conn.query(
        "
        SELECT 
            id, 
            REPLACE(start_time::TEXT, ' ', 'T'), 
            REPLACE(end_time::TEXT, ' ', 'T'), 
            id_user 
        FROM 
            trails
        WHERE
            end_time IS NOT NULL 
        ",
        &[],
    )? {
        vec_trails.push(Trail {
            id: row.get(0),
            start_time: row.get(1),
            end_time: row.get(2),
            id_user: row.get(3),
        });
    }
    Ok(vec_trails)
}

/**
 * Loads all trails for a specific user id from the database
 */
pub fn db_select_trails_id_user(conn: &mut postgres::Client, data: Id) -> Result<Vec<Trail>, Error> {
    let mut vec_trails: Vec<Trail> = Vec::new();
    for row in conn.query(
        "
        SELECT 
            id, 
            REPLACE(start_time::TEXT, ' ', 'T'), 
            REPLACE(end_time::TEXT, ' ', 'T'), 
            id_user 
        FROM 
            trails
        WHERE 
            (id_user=$1) AND (end_time IS NOT NULL)
        ",
        &[&data.id],
    )? {
        vec_trails.push(Trail {
            id: row.get(0),
            start_time: row.get(1),
            end_time: row.get(2),
            id_user: row.get(3),
        });
    }
    Ok(vec_trails)
}

/**
 * Loads all coords for a specific trail id from the database
 */
pub fn db_select_coords_id_trail(conn: &mut postgres::Client, data: Id) -> Result<Vec<Coord>, Error> {
    let mut vec_coord: Vec<Coord> = Vec::new();
    for row in conn.query(
        "SELECT 
            id, 
            id_trail, 
            longitude, 
            latitude, 
            REPLACE(timecode::TEXT, ' ', 'T') 
        FROM 
            coords
        WHERE 
            id_trail=$1
        ",
        &[&data.id],
    )? {
        vec_coord.push(Coord {
            id: row.get(0),
            id_trail: row.get(1),
            longitude: row.get(2),
            latitude: row.get(3),
            timecode: row.get(4),
        });
    }
    Ok(vec_coord)
}

/**
 * Loads all friends for a specific user id from the database
 */
pub fn db_select_friends_id_user(conn: &mut postgres::Client, data: Id) -> Result<Vec<ApiFriend>, Error> {
    let mut vec_friends: Vec<ApiFriend> = Vec::new();
    for row in conn.query(
        "
        SELECT
            id_friend,
            name_friend
        FROM 
            friendsview
        WHERE 
            id_user=$1
        ",
        &[&data.id],
    )? {
        vec_friends.push(ApiFriend {
            id: row.get(0),
            name_friend: row.get(1),
        });
    }
    Ok(vec_friends)
}

/**
 * Loads all friend pairings from the database
 */
pub fn db_select_friends(conn: &mut postgres::Client) -> Result<Vec<Friend>, Error> {
    let mut vec_friends: Vec<Friend> = Vec::new();
    for row in conn.query(
        "
        SELECT 
            id_user,
            id_friend
        FROM 
            friends
        ", 
        &[]
    )? {
        vec_friends.push(Friend {
            id: row.get(0),
            id_friend: row.get(1),
        });
    }
    Ok(vec_friends)
}

/*
    DELETE FUNCTIONS
*/

/**
 * Deletes a user from the database
 */
pub fn db_delete_user(conn: &mut postgres::Client, data: Id) -> Result<(), Error> {
    conn.execute(
        "
        DELETE FROM 
            users 
        WHERE
            id=$1
        ",
        &[&data.id],
    )?;
    Ok(())
}

/**
 * Deletes a trail from the database
 */
pub fn db_delete_trail(conn: &mut postgres::Client, data: Id) -> Result<(), Error> {
    conn.execute(
        "
        DELETE FROM 
            trails
        WHERE
            id=$1
        ",
        &[&data.id],
    )?;
    Ok(())
}

/**
 * Returns a user id and mail if password is correct
 */
pub fn db_login(conn: &mut postgres::Client, login: Login) -> Result<Vec<UserInfo>, Error> {
    let mut vec_ui: Vec<UserInfo> = Vec::new();
    for row in conn.query(
        "
        SELECT 
            id,
            name,
            age,
            mail
        FROM
            users
        WHERE
            (mail=$1 AND pwd=crypt($2, pwd))
        ",
        &[&login.mail, &login.password],
    )? {
        vec_ui.push(UserInfo {
            id: row.get(0),
            name: row.get(1),
            age: row.get(2),
            mail: row.get(3)
        });
    }
    if vec_ui.len() == 0 {
        vec_ui.push(UserInfo {
            id: -1,
            name: "".to_string(),
            age: -1,
            mail: "".to_string()
        });
    }
    Ok(vec_ui)
}
