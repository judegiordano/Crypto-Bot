import { Message } from "discord.js";

import { ICommandHandler } from "../Types/Abstract";

export default {
	prefix: "ping",
	requiredArgs: false,
	arguments: [],
	properUsage: "$ping",
	resolver: async (msg: Message) => {
		await msg.reply("pong");
	}
} as ICommandHandler;