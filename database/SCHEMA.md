# Schema for the database

Trails(id, start_time, end_time, id_user)

Coords(id, id_trail, longitude, latitude, timecode)

Users(id, name, age, mail, pwd)

Friends(id, id_user, id_friend)

---

Where id_trail, id_user, and id_friend are foreign keys
