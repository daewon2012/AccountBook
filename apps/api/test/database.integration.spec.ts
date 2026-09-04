import { PrismaClient } from '@prisma/client';

describe('PostgreSQL integration', () => {
  const prisma = new PrismaClient();
  afterAll(() => prisma.$disconnect());

  it('connects through PgBouncer', async () => {
    const rows = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 AS value`;
    expect(rows).toEqual([{ value: 1 }]);
  });
});
