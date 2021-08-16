const { DB_TYPE, DB_HOST } = process.env;

const DB_SYNC = process.env.DB_SYNC == "true" ? true : false;
const DB_LOGGING = process.env.DB_LOGGING == "true" ? true : false;

export default {
	type: DB_TYPE,
	url: DB_HOST,
	useNewUrlParser: true,
	synchronize: DB_SYNC,
	logging: DB_LOGGING,
	ssl: true,
	entities: ["./src/Models/**/*.ts"],
	migrations: ["./src/Migrations/**/*.ts"],
	cli: {
		entitiesDir: ["./src/Models/**/*.ts"],
		migrationsDir: ["./src/Migrations/**/*.ts"],
	},
	cache: true
};