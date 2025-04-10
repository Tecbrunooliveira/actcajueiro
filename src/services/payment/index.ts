
import { paymentBaseService } from './paymentBaseService';
import { paymentQueryService } from './paymentQueryService';
import { paymentAnalyticsService } from './paymentAnalyticsService';
import { paymentGenerationService } from './paymentGenerationService';
import { paymentMapperService } from './paymentMapperService';

// Combinando todos os serviços em um único objeto exportado
export const paymentService = {
  ...paymentBaseService,
  ...paymentQueryService,
  ...paymentAnalyticsService,
  ...paymentGenerationService,
};

// Exportando cada serviço individualmente para uso específico
export {
  paymentBaseService,
  paymentQueryService,
  paymentAnalyticsService,
  paymentGenerationService,
  paymentMapperService
};
