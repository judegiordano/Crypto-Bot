import { Message } from "discord.js";

import { ICommandHandler } from "../Types/Abstract";
import { Server } from "../Repositories/ServerRepository";
import { Rest } from "../Services/Rest";
import { Bot } from "../Services/Bot";

export default {
	prefix: "track",
	requiredArgs: true,
	arguments: ["symbol"],
	properUsage: "$track <coin id i.e. bitcoin>",
	resolver: async (msg: Message, args: string[]) => {
		const coin = args[0] as string;
		const { thumbnail } = await Rest.SetNickName(msg.guild!, coin);
		await Server.UpdateTrackedCoin(msg.guild!.id, coin);
		await Bot.Message(msg, [{
			name: "Success!",
			value: `\`\`\`Tracking ${coin}\`\`\``
		}], true, thumbnail);
	}
} as ICommandHandler;