import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum EnvironmentType {
  Dev = 'dev',
  Prod = 'prod',
}

class EnvironmentVariables {
  @IsEnum(EnvironmentType)
  NODE_ENV: EnvironmentType;

  @IsNumber()
  PORT: number;

  @IsString()
  MONGODB_URL: string;

  @IsString()
  JWT_SECRET: string;
}

export function validate(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: true });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return finalConfig;
}
