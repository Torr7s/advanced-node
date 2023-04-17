import { newDb } from 'pg-mem';
import { Column, Entity, PrimaryGeneratedColumn, getRepository } from 'typeorm';

import { type LoadUserAccountRepository } from '@/data/contracts/repositories';

@Entity({ name: 'usuarios' })
export class PgUser {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({
		name: 'nome',
		nullable: true,
	})
	name?: string;

	@Column()
	email!: string;

	@Column({
		name: 'id_facebook',
		nullable: true,
	})
	facebookId?: string;
}

export class PgUserAccountRepository implements LoadUserAccountRepository {
	public async load(
		input: LoadUserAccountRepository.Input,
	): Promise<LoadUserAccountRepository.Output> {
		const pgUserRepository = getRepository(PgUser);

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

describe('PgUserAccountRepository', (): void => {
	describe('load', (): void => {
		it('should return an account if email exists', async (): Promise<void> => {
			const db = newDb();

			const connection = await db.adapters.createTypeormConnection({
				type: 'postgres',
				entities: [PgUser],
			});

			await connection.synchronize();

			const pgUserRepository = getRepository(PgUser);

			await pgUserRepository.save({
				email: 'johndoe@example.com',
			});

			const sut = new PgUserAccountRepository();

			const account = await sut.load({ email: 'johndoe@example.com' });

			expect(account).toEqual({
				id: '1',
			});

			await connection.close();
		});

		it('should return undefined if email does not exists', async (): Promise<void> => {
			const db = newDb();

			const connection = await db.adapters.createTypeormConnection({
				type: 'postgres',
				entities: [PgUser],
			});

			await connection.synchronize();

			const sut = new PgUserAccountRepository();

			const account = await sut.load({ email: 'johndoe@example.com' });

			expect(account).toBeUndefined();
		});
	});
});
