import { swaggerSchemaExample } from '../../share/utils/swagger_schema';

export const USER_CONST = {
  MODEL_NAME: 'user',
  MODEL_PROVIDER: 'USER_MODEL',
};
export const SWAGGER_RESPONSE = {
  HEALTH_CHECK: swaggerSchemaExample(
    {
      data: {
        message: 'OK Test',
      },
      statusCode: 200,
    },
    'API for health check',
  ),
};
