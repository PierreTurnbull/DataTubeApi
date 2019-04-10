import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'region'
})
export class RegionsEntity {
  @PrimaryColumn({
    length: 2
  })
  id: string;

  @Column({
    length: 64
  })
  name: string;
}