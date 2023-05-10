--------------------------------------------------
-- This file defines the views for the database --
--                                              --
-- Date: 2022-10-13                             --
-- Author: Jakob Fridesjö                       --
-- Email: tfy17jfo@cs.umu.se                    --
--------------------------------------------------

-- Create a view for getting friend id and name
CREATE VIEW friendsview AS
SELECT
	friends.id_user, 
	friends.id_friend,
	users.name AS name_friend
FROM
	friends, users
WHERE
	id_friend=users.id
;
