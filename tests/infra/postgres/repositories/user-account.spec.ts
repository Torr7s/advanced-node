import { type IMemoryDb, type IBackup } from 'pg-mem';
import { type Repository, getConnection, getRepository } from 'typeorm';

import { createFakeDatabase } from '../mocks';

import { PgUser } from '@/infra/postgres/entities';
import { PgUserAccountRepository } from '@/infra/postgres/repositories';

describe('PgUserAccountRepository', (): void => {
	let sut: PgUserAccountRepository;
	let pgUserRepository: Repository<PgUser>;

	let backup: IBackup;

	beforeAll(async (): Promise<void> => {
		const db: IMemoryDb = await createFakeDatabase([PgUser]);

		backup = db.backup();

		pgUserRepository = getRepository(PgUser);
	});

	afterAll(async (): Promise<void> => {
		await getConnection().close();
	});

	beforeEach((): void => {
		backup.restore();

		sut = new PgUserAccountRepository();
	});

	describe('load', (): void => {
		const email = 'email@example.com';

		it('should return an account if email exists', async (): Promise<void> => {
			await pgUserRepository.save({ email });

			const account = await sut.load({ email });

			expect(account).toEqual({
				id: '1',
			});
		});

		it('should return undefined if email does not exists', async (): Promise<void> => {
			const account = await sut.load({ email });

			expect(account).toBeUndefined();
		});
	});

	describe('saveWithFacebook', (): void => {
		it('should create an account if id is undefined', async (): Promise<void> => {
			await sut.saveWithFacebook({
				facebookId: 'any_facebook_id',
				name: 'any_name',
				email: 'any_email',
			});

			const pgUser = await pgUserRepository.findOne({
				where: {
					email: 'any_email',
				},
			});

			expect(pgUser?.id).toBe(1);
		});
	});
});
