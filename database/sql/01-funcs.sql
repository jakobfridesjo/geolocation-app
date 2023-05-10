---------------------------------------------------------------------
-- This file defines the functions and procedures for the database --
--                                                                 --
-- Date: 2022-10-11                                                --
-- Author: Jakob Fridesjö                                          --
-- Email: tfy17jfo@cs.umu.se                                       --
---------------------------------------------------------------------

CREATE EXTENSION pgcrypto;

-- Check if coordinates are within the valid span
CREATE OR REPLACE FUNCTION check_coordinates()
    RETURNS trigger AS $BODY$
BEGIN
    IF (ABS(NEW.longitude) <= 180) AND (ABS(NEW.latitude) <= 90) THEN
	RETURN NEW;
    ELSE
        RETURN NULL;
    END IF;
END $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER check_coordinates_before_insert
BEFORE INSERT ON coords
FOR EACH ROW
EXECUTE PROCEDURE check_coordinates();


-- Check if user is correct and hash password
CREATE OR REPLACE FUNCTION check_user()
    RETURNS trigger AS $BODY$
BEGIN
    IF (LENGTH(NEW.name) >= 6) AND (NEW.age >= 0) AND (LENGTH(NEW.pwd) >= 8) THEN
	    NEW.pwd = crypt(NEW.pwd, gen_salt('bf', 8));
	    RETURN NEW;
    ELSE
        RETURN NULL;
    END IF;
END $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER check_user_before_insert
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE PROCEDURE check_user();

-- Check if name is correct
CREATE OR REPLACE FUNCTION check_name()
    RETURNS trigger AS $BODY$
BEGIN
    IF (LENGTH(NEW.name) >= 6) THEN
	    RETURN NEW;
    ELSE
        RETURN NULL;
    END IF;
END $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER check_name_before_update
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE check_name();

-- Check if name is correct
CREATE OR REPLACE FUNCTION check_password()
    RETURNS trigger AS $BODY$
BEGIN
    IF (LENGTH(NEW.pwd) >= 8) THEN
	    RETURN NEW;
    ELSE
        RETURN NULL;
    END IF;
END $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER check_password_before_update
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE check_password();
