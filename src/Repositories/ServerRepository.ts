import { Server as _Server } from "../Models/Server";
import { Rest } from "../Services/Rest";

export class Server {

	public static async FindById(serverId: string): Promise<_Server | boolean> {
		try {
			const exists = await _Server.findOne({ serverId });
			if (!exists) return false;
			return exists;
		} catch (error) {
			return false;
		}
	}

	public static async GetAllServers(): Promise<Partial<_Server>[]> {
		try {
			const temp = [];
			const servers = await _Server.find({ select: ["serverId", "trackedCoin"] });
			for (const server of servers) {
				temp.push({ serverId: server.serverId, trackedCoin: server.trackedCoin });
			}
			return temp;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async InsertServer(server: Partial<_Server>): Promise<_Server> {
		try {
			const newServer = new _Server({
				serverId: server.serverId,
				serverName: server.serverName,
				trackedCoin: Rest.currentCoin
			});
			return newServer.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async RemoveServer(serverId: string): Promise<_Server> {
		try {
			const exists = await _Server.findOne({ serverId });
			if (!exists) throw "server not found";
			const done = await exists.remove();
			return done;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async UpdateTrackedCoin(serverId: string, trackedCoin: string): Promise<_Server> {
		try {
			const exists = await _Server.findOne({ where: { serverId }, cache: 60000 });
			if (!exists) throw "server not registered";

			exists.trackedCoin = trackedCoin;
			return exists.save();
		} catch (error) {
			throw new Error(error);
		}
	}
}