import DefaultEntity from 'src/helpers/default.entity';
import { Column, Entity } from 'typeorm';

@Entity('alerts')
export class AlertsEntity extends DefaultEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'color',
    type: 'varchar',
    nullable: false,
  })
  color: string;

  @Column({
    name: 'priority',
    type: 'int4',
    nullable: false,
  })
  priority: number;
}
