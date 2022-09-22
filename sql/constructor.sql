CREATE DATABASE "alphagamesocket";
\c "alphagamesocket"

CREATE TABLE public.users (
	"id" varchar(36) NOT NULL UNIQUE,
	"username" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
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
	"id" serial NOT NULL,
	"winner" varchar(36) NOT NULL,
	"started_at" varchar(255) NOT NULL,
	"finished_at" varchar(255) NOT NULL,
	CONSTRAINT "matchs_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.match_users (
	"match_id" integer NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"level" real NOT NULL,
	"score" real NOT NULL,
	"state" varchar(255) NOT NULL,
	"character" integer NOT NULL,
	CONSTRAINT "match_users_pk" PRIMARY KEY ("match_id","user_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.ranking (
	"id" serial NOT NULL,
	"user_id" varchar(36) NOT NULL UNIQUE,
	"score" real NOT NULL,
	CONSTRAINT "ranking_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "matchs" ADD CONSTRAINT "matchs_fk0" FOREIGN KEY ("winner") REFERENCES "users"("id");

ALTER TABLE "match_users" ADD CONSTRAINT "match_users_fk0" FOREIGN KEY ("match_id") REFERENCES "matchs"("id");
ALTER TABLE "match_users" ADD CONSTRAINT "match_users_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "ranking" ADD CONSTRAINT "ranking_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");




