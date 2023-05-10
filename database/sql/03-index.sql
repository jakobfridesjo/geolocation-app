-----------------------------------------------------
-- This file defines some indexes for the database --
--                                                 --
-- Date: 2022-10-13                                --
-- Author: Jakob Fridesjö                          --
-- Email: tfy17jfo@cs.umu.se                       --
-----------------------------------------------------

-- Create a index for friends
CREATE INDEX ON friends (id_user);
	
-- Create user index
CREATE INDEX ON users (mail, pwd);
