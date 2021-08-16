/* eslint-disable no-unused-vars */
import { Message } from "discord.js";

export interface ICommandHandler {
	prefix: string,
	requiredArgs: boolean,
	arguments: string[],
	properUsage: string,
	resolver: (msg: Message, args?: string[]) => Promise<void>,
}

export enum Constants {
	Prefix = "$",
	Coins = "https://www.coingecko.com/en",
	Invite = "https://discord.com/api/oauth2/authorize?client_id=876175899786104843&permissions=8&scope=bot",
	Error = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fc%2Fc6%2FExclamation_Circle_Red.svg%2F768px-Exclamation_Circle_Red.svg.png&f=1&nofb=1",
	Profile = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fexternal-preview.redd.it%2FJ5JddfNQhpkNxV-Xa9cS0qDNE6JEMwdovfwzSQBUuis.png%3Fauto%3Dwebp%26s%3Da6d28ae76bc538d751b7976c6e9d0095c371c070&f=1&nofb=1"
}

export enum Colors {
	Green = "GREEN",
	Red = "RED"
}