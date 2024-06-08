import dotenv from "dotenv";
import {env} from "process";

dotenv.config();

export const {
	NODE_ENV="production",
	DB_HOST="localhost",
	DB_PORT="5432",
	DB_DATABASE="brbot_db",
	DB_USERNAME="test",
	DB_PASSWORD="1234",
	REDIS_AUTH="redis://default:redispw@localhost:6379",
	BODY_LIMIT="50mb",
	JWT_SECRET="jacareperneta",
	GAME_HOST="http://localhost",
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	GOOGLE_OAUTH_REDIRECT,
} = env;