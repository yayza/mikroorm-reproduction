import { defineEntity, MikroORM } from '@mikro-orm/postgresql';

const Product = defineEntity({
  name: 'Product',
  properties: p => ({
    id: p.integer().primary(),
    price: p.decimal().precision(12).scale(2).default('0.00'),
  }),
});

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: 'mikro_orm_repro',
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: +(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    entities: [Product],
    allowGlobalContext: true,
  });
  await orm.schema.ensureDatabase();
  await orm.schema.refresh();
});

afterAll(async () => {
  await orm.close(true);
});

test('schema is up to date immediately after being created', async () => {
  const sql = await orm.schema.getUpdateSchemaSQL();
  expect(sql).toBe('');
});
