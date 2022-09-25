CREATE DATABASE "alphagamesocket";
\c "alphagamesocket"

CREATE TABLE public.users (
	"id" varchar(36) NOT NULL UNIQUE,
	"username" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"score" real NOT NULL DEFAULT '0',
	"last_character" integer,
	"avatar" varchar(255),
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP,
	"logged_at" TIMESTAMP,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.matchs (
	"id" varchar(36) NOT NULL UNIQUE,
	"winner" varchar(36) NOT NULL,
	"started_at" varchar(255) NOT NULL,
	"finished_at" varchar(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	CONSTRAINT "matchs_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.match_users (
	"match_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"character" integer NOT NULL,
	"score" real NOT NULL,
	"state" varchar(255),
	"created_at" TIMESTAMP NOT NULL,
	CONSTRAINT "match_users_pk" PRIMARY KEY ("match_id","user_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.ranking (
	"id" serial NOT NULL,
	"user_id" varchar(36),
	"score" real NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP,
	CONSTRAINT "ranking_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "matchs" ADD CONSTRAINT "matchs_fk0" FOREIGN KEY ("winner") REFERENCES "users"("id");

ALTER TABLE "match_users" ADD CONSTRAINT "match_users_fk0" FOREIGN KEY ("match_id") REFERENCES "matchs"("id");
ALTER TABLE "match_users" ADD CONSTRAINT "match_users_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "ranking" ADD CONSTRAINT "ranking_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

INSERT INTO ranking (user_id, score, created_at) VALUES (NULL, 0, now()), (NULL, 0, now()), (NULL, 0, now()), (NULL, 0, now(), (NULL, 0, now());


CREATE or REPLACE VIEW history_view AS
    SELECT user_id, id AS match_id, winner, started_at, finished_at, matchs.created_at
    FROM match_users
    INNER JOIN matchs
    ON match_users.match_id = matchs.id;

CREATE or REPLACE VIEW history_player_view AS
    SELECT match_id, users.username, "character", match_users.score, "state", match_users.created_at
    FROM match_users
    INNER JOIN users
    ON match_users.user_id = users.id;

CREATE or REPLACE VIEW ranking_view AS
    SELECT ranking.id, users.username, ranking.score, ranking.created_at
    FROM ranking
    INNER JOIN users
    ON ranking.user_id = users.id;