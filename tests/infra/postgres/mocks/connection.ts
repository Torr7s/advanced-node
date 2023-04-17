import { type IMemoryDb, newDb } from 'pg-mem';

export const createFakeDatabase = async (
	entities?: any[],
): Promise<IMemoryDb> => {
	const db: IMemoryDb = newDb();

	const connection: any = await db.adapters.createTypeormConnection({
		type: 'postgres',
		entities: entities ?? ['src/infra/postgres/entities/index.ts'],
	});

	await connection.synchronize();

	return db;
};
