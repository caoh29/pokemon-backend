import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateSeedDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  readonly amount: number;
}
