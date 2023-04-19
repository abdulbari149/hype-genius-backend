import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { plainToInstance } from 'class-transformer';
import CurrencyEntity from '../app/currency/entities/currency.entity';

export class CurrencySeeder implements Seeder {
  async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const query_runner = dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const currencies = [
        {
          name: 'usd',
        },
        {
          name: 'gbp',
        },
        {
          name: 'eur',
        },
        {
          name: 'cad',
        },
      ];
      const currencies_entity = plainToInstance(CurrencyEntity, currencies);
      await query_runner.manager.save(currencies_entity);
      await query_runner.commitTransaction();
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
