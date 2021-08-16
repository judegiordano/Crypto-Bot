import fs from "fs";
import path from "path";
import { Client, Intents, Message, MessageEmbed, EmbedFieldData, Guild } from "discord.js";

import { Config } from "./Config";
import { Database } from "./Database";
import { Rest } from "./Rest";
import { Server as _Server } from "../Models/Server";
import { Server } from "../Repositories/ServerRepository";
import { ICommandHandler, Constants, Colors } from "../Types/Abstract";

export class Bot {

	private static readonly Secrets = Config.Secrets;
	private static Client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
	private static readonly CommandsDir = path.join(__dirname, "../Commands");
	private static readonly Commands = [] as ICommandHandler[];

	private static async UpdatePrices(client: Client) {
		try {
			return setInterval(async () => {
				const servers = await Server.GetAllServers();
				for (const server of servers) {
					const { serverId, trackedCoin } = server as _Server;
					const guild = client.guilds.cache.find(a => a.id == serverId) as Guild;
					await Rest.SetNickName(guild, trackedCoin);
				}
			}, 60_000);
		} catch (error) {
			throw new Error(error);
		}
	}

	private static async ReadyHandler(client: Client): Promise<void> {
		try {
			console.log(`${Bot.Client.user?.tag} logged in`);
			client.user!.setActivity("to the moon! 🚀");

			client.guilds.cache.forEach(async (guild: Guild) => {
				const roleExists = guild.roles.cache.find(a => a.name == "Crypto-Bot-Trader");
				if (!roleExists) {
					await guild.roles.create({
						name: "Crypto-Bot-Trader",
						hoist: true,
						reason: "this role is needed to track currencies"
					});
				}
				const server = await Server.FindById(guild.id);
				if (server) {
					const { trackedCoin } = server as _Server;
					return await Rest.SetNickName(guild, trackedCoin);
				}
				const newServer = await Server.InsertServer({
					serverName: guild.name,
					serverId: guild.id
				});
				return await Rest.SetNickName(guild, newServer.trackedCoin);
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	private static async JoinGuildHandler(guild: Guild): Promise<void> {
		try {
			const roleExists = guild.roles.cache.find(a => a.name == "Crypto-Bot-Trader");
			if (!roleExists) {
				await guild.roles.create({
					name: "Crypto-Bot-Trader",
					hoist: true,
					reason: "this role is needed to track currencies"
				});
			}
			const server = await Server.FindById(guild.id);
			if (server) {
				const { trackedCoin } = server as _Server;
				await Rest.SetNickName(guild, trackedCoin);
				return;
			}
			const newServer = await Server.InsertServer({
				serverName: guild.name,
				serverId: guild.id
			});
			await Rest.SetNickName(guild, newServer.trackedCoin);
		} catch (error) {
			throw new Error(error);
		}
	}

	private static async ImportCommands(): Promise<void> {
		try {
			fs.readdir(Bot.CommandsDir, async (err, files) => {
				if (err) throw err;
				for (const file in files) {
					const handler = (await import(`${Bot.CommandsDir}/${files[file]}`)).default as ICommandHandler;
					console.log(handler);
					Bot.Commands.push(handler);
				}
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	private static async Setup(): Promise<void> {
		try {
			await Database.Connect();
			await Bot.Client.login(Bot.Secrets.BOT_TOKEN);

			Bot.Client.once("ready", Bot.ReadyHandler);

			Bot.Client.on("guildCreate", Bot.JoinGuildHandler);

			Bot.Client.on("guildDelete", async (guild: Guild) => {
				await Server.RemoveServer(guild.id);
			});

			await Bot.ImportCommands();

			Bot.Client.on("messageCreate", Bot.MessageHandler);

			await Bot.UpdatePrices(Bot.Client);
		} catch (error) {
			throw new Error(error);
		}
	}

	private static async MessageHandler(msg: Message): Promise<void> {
		try {
			if (!msg.guild) return;
			if (msg.author.bot) return;
			if (!msg.content.startsWith(Constants.Prefix)) return;

			const role = msg.guild?.roles.cache.find(a => a.name == "Crypto-Bot-Trader");
			const auth = role?.members.find(a => a.id == msg.author.id);
			if (!auth) return;

			const prefix = msg.content.split(Constants.Prefix)[1];
			const cmd = Bot.Commands.find(a => a.prefix == prefix?.split(" ")[0]);
			if (!cmd) return;

			// strip prefix and remove spaces
			const args = msg.content.split(" ").slice(1).filter(a => a !== null && a.trim() != "");
			if (args.length <= 0 && cmd.requiredArgs || args.length < cmd.arguments.length)
				throw new Error(`This Command Has Required Arguments\nCommand Usage:\n${cmd.properUsage}`);

			await cmd.resolver(msg, args);
		} catch (error) {
			await Bot.Message(
				msg,
				[{ name: "Error:", value: `\`\`\`${error.message}\`\`\`` || "```An Error Has Occured```" }],
				false,
				Constants.Error
			);
		}
	}

	public static async Message(msg: Message, data: EmbedFieldData[], success: boolean, thumbnail?: string): Promise<void> {
		const embed = new MessageEmbed()
			.setAuthor("Invite Me To A Server <-", Constants.Profile, Constants.Invite)
			.setColor(success ? Colors.Green : Colors.Red)
			.setTitle("list of supported coins")
			.setURL(Constants.Coins)
			.setThumbnail(thumbnail || "")
			.addFields(...data)
			.setTimestamp();

		await msg.channel.send({ embeds: [embed] });
	}

	public static async Start(): Promise<void> {
		try {
			await Bot.Setup();
		} catch (error) {
			await Bot.Stop();
		}
	}

	public static async Stop(): Promise<void> {
		try {
			await Database.Close();
			Bot.Client.destroy();
			process.exit(1);
		} catch (error) {
			process.exit(1);
		}
	}
}