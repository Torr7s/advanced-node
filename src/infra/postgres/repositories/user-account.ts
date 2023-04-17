import { type Repository, getRepository } from 'typeorm';

import { PgUser } from '../entities';

import { type LoadUserAccountRepository } from '@/data/contracts/repositories';

export class PgUserAccountRepository implements LoadUserAccountRepository {
	public async load(
		input: LoadUserAccountRepository.Input,
	): Promise<LoadUserAccountRepository.Output> {
		const pgUserRepository: Repository<PgUser> = getRepository(PgUser);

		const pgUser = await pgUserRepository.findOne({
			where: {
				email: input.email,
			},
		});

		if (pgUser != null) {
			return {
				id: pgUser.id.toString(),
				name: pgUser.name ?? undefined,
			};
		}
	}
}
