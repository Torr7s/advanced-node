import { type IBackup, type IMemoryDb, newDb } from 'pg-mem';
import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	type Repository,
	getConnection,
	getRepository,
} from 'typeorm';

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

describe('PgUserAccountRepository', (): void => {
	describe('load', (): void => {
		const email = 'email@example.com';

		let sut: PgUserAccountRepository;
		let pgUserRepository: Repository<PgUser>;

		let backup: IBackup;

		beforeAll(async (): Promise<void> => {
			const db: IMemoryDb = newDb();

			const connection: any = await db.adapters.createTypeormConnection({
				type: 'postgres',
				entities: [PgUser],
			});
			await connection.synchronize();

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
});
