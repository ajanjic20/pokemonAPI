import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function CustomController(controllerName: string) {
  return applyDecorators(Controller(controllerName), ApiTags(controllerName));
}
