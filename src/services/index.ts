
// Reexport everything from service files to maintain backward compatibility
export * from './memberService';
export * from './payment';
export * from './formatters';
export * from './pdfService';
export * from './communicationService';
export * from './expense';

// Create a consolidated paymentService for backward compatibility
import { 
  paymentBaseService,
  paymentQueryService,
  paymentAnalyticsService,
  paymentGenerationService,
  paymentMapperService
} from './payment';

export const paymentService = {
  ...paymentBaseService,
  ...paymentQueryService,
  ...paymentAnalyticsService,
  ...paymentGenerationService,
  ...paymentMapperService,
  
  // Additional methods to ensure backward compatibility
  getPaymentsByMember: paymentQueryService.getPaymentsByMember,
  getPaymentsByMonth: paymentQueryService.getPaymentsByMonth,
  getUnpaidPayments: paymentQueryService.getUnpaidPayments,
  getMemberPaymentStatus: paymentAnalyticsService.getMemberPaymentStatus,
  getMonthlyRecord: paymentAnalyticsService.getMonthlyRecord,
  generatePendingPaymentsForMonth: paymentGenerationService.generatePendingPaymentsForMonth
};
