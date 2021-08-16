export class Config {

	public static readonly Secrets = {
		BOT_TOKEN: process.env.BOT_TOKEN as string,
		BOT_ID: process.env.BOT_ID as string
	}

	public static readonly Rest = {
		API_URL: process.env.API_URL
	}

	public static readonly Db = {
		DB_TYPE: process.env.DB_TYPE,
		DB_HOST: process.env.DB_HOST,
		DB_SYNC: process.env.DB_SYNC === "true" ? true : false,
		DB_LOGGING: process.env.DB_LOGGING === "true" ? true : false
	}
}