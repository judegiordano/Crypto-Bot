import { ObjectIdColumn, BaseEntity, CreateDateColumn, BeforeUpdate, BeforeInsert, Column } from "typeorm";

import { Helpers } from "../Services/Helpers";

export abstract class Base extends BaseEntity {

	@ObjectIdColumn()
	_id: Object;

	@Column()
	uuid: string;

	@CreateDateColumn()
	createdAt: Date;

	@Column()
	updatedAt: Date;

	@BeforeUpdate()
	@BeforeInsert()
	public setTime() {
		this.updatedAt = new Date();
	}

	@BeforeInsert()
	public createUuid() {
		this.uuid = Helpers.CreateUUID();
	}
}
