import axios, { AxiosResponse } from "axios";
import { Guild, GuildMember } from "discord.js";

import { Config } from "./Config";

interface ICoinData {
	price: number,
	thumbnail: string
}

export class Rest {

	private static client = axios.create({
		baseURL: Config.Rest.API_URL
	});

	public static currentCoin = "dogecoin";

	public static async Get(symbol: string): Promise<AxiosResponse<any>> {
		try {
			return await Rest.client.get(symbol);
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async GetPrice(symbol: string): Promise<ICoinData> {
		try {
			const { data } = await Rest.Get(symbol);
			return {
				price: data.market_data.current_price.usd,
				thumbnail: data.image.large
			};
		} catch (error) {
			throw new Error("coin not found");
		}
	}

	public static async SetNickName(guild: Guild, symbol: string): Promise<ICoinData> {
		try {
			const { price, thumbnail } = await Rest.GetPrice(symbol);

			const self = guild.members.cache.get(Config.Secrets.BOT_ID) as GuildMember;
			self.setNickname(`${symbol}: $${price}`);
			return {
				price,
				thumbnail
			};
		} catch (error) {
			throw new Error(error);
		}
	}
}