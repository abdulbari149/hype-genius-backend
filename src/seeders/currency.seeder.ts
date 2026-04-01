import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { plainToInstance } from 'class-transformer';
import CurrencyEntity from '../app/currency/entities/currency.entity';

const CURRENCY_NAMES = ['usd', 'gbp', 'eur', 'cad'] as const;

export class CurrencySeeder implements Seeder {
  async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const query_runner = dataSource.createQueryRunner();
    try {
      await query_runner.connect();
      await query_runner.startTransaction();
      for (const name of CURRENCY_NAMES) {
        const exists = await query_runner.manager.findOne(CurrencyEntity, {
          where: { name },
        });
        if (!exists) {
          await query_runner.manager.save(
            plainToInstance(CurrencyEntity, { name }),
          );
        }
      }
      await query_runner.commitTransaction();
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
