--------------------------------------------------
-- This file setups the tables for the database --
--                                              --
-- Date: 2022-10-11                             --
--------------------------------------------------

CREATE TABLE users(
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR NOT NULL,
    age INT NOT NULL,
    mail VARCHAR NOT NULL UNIQUE,
    pwd VARCHAR NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE trails(
    id INT GENERATED ALWAYS AS IDENTITY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    id_user INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user
        FOREIGN KEY (id_user)
            REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE TABLE friends(
    id_user INT NOT NULL,
    id_friend INT NOT NULL,
    PRIMARY KEY (id_user, id_friend),
    CONSTRAINT fk_user
        FOREIGN KEY (id_user)
            REFERENCES users(id)
            ON DELETE CASCADE,
    CONSTRAINT fk_friend
        FOREIGN KEY (id_friend)
            REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE TABLE coords(
    id INT GENERATED ALWAYS AS IDENTITY,
    id_trail INT NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    timecode TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_trail
        FOREIGN KEY (id_trail)
            REFERENCES trails(id)
            ON DELETE CASCADE
);
