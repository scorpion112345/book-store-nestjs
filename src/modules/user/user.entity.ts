import {
	BaseEntity,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinTable,
	ManyToMany,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm';
import { UserDetails } from './user.details.entity';
import { Role } from '../role/role.entity';

@Entity('users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('increment') id: number;

	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	username: string;

	@Column({ type: 'varchar', nullable: false })
	email: string;

	@Column({ type: 'varchar', nullable: false })
	password: string;

	@JoinColumn({ name: 'detail_id' })
	@OneToOne((type) => UserDetails, { cascade: true, nullable: false, eager: true })
	details: UserDetails;

	@ManyToMany((type) => Role, (role) => role.users, { eager: true })
	@JoinTable({ name: 'user_roles' })
	roles: Role[];

	@Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
	status: string;

	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
	updateAt: Date;
}
