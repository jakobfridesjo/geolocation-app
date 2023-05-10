-- INSERT USERS          
INSERT INTO users (name, age, mail, pwd)
VALUES (
	'Anders Andersson', 
	'51', 
	'anders.andersson@gmail.com', 
	'password123'
);

INSERT INTO users (name, age, mail, pwd)
VALUES (
	'Bnders Bndersson', 
	'52', 
	'bnders.bndersson@gmail.com', 
	'password234'
);

INSERT INTO users (name, age, mail, pwd)
VALUES (
	'Cnders Cndersson', 
	'53', 
	'cnders.cndersson@gmail.com', 
	'password345'
);

INSERT INTO users (name, age, mail, pwd)
VALUES (
	'Dnders Dndersson', 
	'54', 
	'dnders.dndersson@gmail.com', 
	'password456'
);

-- INSERT SOME FRIEND RELATIONS
INSERT INTO friends (id_user, id_friend)
VALUES (
	1,
	2
);

-- INSERT SOME FRIEND RELATIONS
INSERT INTO friends (id_user, id_friend)
VALUES (
	2,
	1
);

-- INSERT SOME FRIEND RELATIONS
INSERT INTO friends (id_user, id_friend)
VALUES (
	3,
	4
);

-- INSERT TRAILS AND COORDS
INSERT INTO trails (id_user, start_time, end_time)
VALUES (
	1, 
	to_timestamp('2022-10-02T17:07:01+02:00', 'YYYY-MM-DDThh24:mi:ssTZH:TZM'), 
	to_timestamp('2022-10-02T18:00:00+02:00', 'YYYY-MM-DDThh24:mi:ssTZH:TZM')
);

INSERT INTO coords (id_trail, longitude, latitude, timecode)
VALUES (
	1, 
	64.0000, 
	20.0000,
	'2022-10-02 17:07:10'
);

INSERT INTO coords (id_trail, longitude, latitude, timecode)
VALUES (
	1, 
	65.0000, 
	21.0000,
	'2022-10-02 17:07:20'
);

INSERT INTO trails (id_user, start_time, end_time)
VALUES (
	1, 
	to_timestamp('2022-10-03T16:03:01+02:00', 'YYYY-MM-DDThh24:mi:ssTZH:TZM'), 
	to_timestamp('2022-10-03T19:00:00+02:00', 'YYYY-MM-DDThh24:mi:ssTZH:TZM')
);
