import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { EEstatus } from '../../shared/entity-status.enum';

@Injectable()
export class RoleService {
	constructor(@InjectRepository(RoleRepository) private readonly _roleRepository: RoleRepository) {}

	async get(id: number): Promise<Role> {
		if (!id) {
			throw new BadRequestException('id must be send');
		}
		const role: Role = await this._roleRepository.findOne(id, { where: { status: EEstatus.ACTIVE } });
		if (!role) {
			throw new NotFoundException();
		}
		return role;
	}

	async getAll(): Promise<Role[]> {
		const roles: Role[] = await this._roleRepository.find({ where: { status: EEstatus.ACTIVE } });
		return roles;
	}

	async create(role: Role): Promise<Role> {
		const savedRole = await this._roleRepository.save(role);
		return savedRole;
	}

	async update(id: number, role: Role): Promise<void> {
		await this._roleRepository.update(id, role);
	}

	async delete(id: number): Promise<void> {
		const roleExist = await this._roleRepository.findOne(id, { where: { status: EEstatus.ACTIVE } });
		if (!roleExist) {
			throw new NotFoundException();
		}
		await this._roleRepository.update(id, { status: EEstatus.INACTIVE });
	}
}
