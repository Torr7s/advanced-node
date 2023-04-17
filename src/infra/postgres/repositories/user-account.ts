import { type Repository, getRepository } from 'typeorm';

import { PgUser } from '../entities';

import {
	type SaveFacebookAccountRepository,
	type LoadUserAccountRepository,
} from '@/data/contracts/repositories';

type LoadInput = LoadUserAccountRepository.Input;
type LoadOutput = LoadUserAccountRepository.Output;

type SaveInput = SaveFacebookAccountRepository.Input;

export class PgUserAccountRepository implements LoadUserAccountRepository {
	private readonly repository: Repository<PgUser> = getRepository(PgUser);

	public async load(input: LoadInput): Promise<LoadOutput> {
		const pgUser = await this.repository.findOne({
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

	public async saveWithFacebook(input: SaveInput): Promise<void> {
		if (input.id === undefined) {
			await this.repository.save({
				facebookId: input.facebookId,
				name: input.name,
				email: input.email,
			});
		} else {
			await this.repository.update(
				{
					id: parseInt(input.id),
				},
				{
					name: input.name,
					facebookId: input.facebookId,
				},
			);
		}
	}
}
