import "dotenv/config";
import "reflect-metadata";

import { Bot } from "./Services/Bot";

(async () => {
	await Bot.Start();
})();
