import { Entity, Column } from "typeorm";

import { Base } from "./Base";

@Entity()
export class Server extends Base {

	constructor(data?: Partial<Server>) {
		super();
		Object.assign(this, data);
	}

	@Column({ nullable: false })
	serverName: string;

	@Column({ nullable: true })
	trackedCoin: string;

	@Column({ unique: true, nullable: false })
	serverId: string;
}