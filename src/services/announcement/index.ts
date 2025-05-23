export * from './announcementBaseService';
export * from './announcementRecipientsService';
export * from './announcementQueryService';

// Create a consolidated service for backward compatibility
import { announcementBaseService } from './announcementBaseService';
import { announcementRecipientsService } from './announcementRecipientsService';
import { announcementQueryService } from './announcementQueryService';

// Re-export the cleanup service
export { cleanupOrphanedRecipients } from './services/cleanupService';

export const announcementService = {
  ...announcementBaseService,
  ...announcementRecipientsService,
  ...announcementQueryService,
  
  // Expose the specific services to allow direct access to their methods
  announcementBaseService,
  announcementRecipientsService,
  announcementQueryService,
  
  // Combine createAnnouncement and addRecipients for backward compatibility
  async createAnnouncement(params: { title: string; content: string; is_global: boolean; memberIds?: string[] }) {
    const announcementId = await announcementBaseService.createAnnouncement(params);
    await announcementRecipientsService.addRecipients(announcementId, params.is_global, params.memberIds);
    return announcementId;
  },
  
  // Alias confirmReceipt as confirmAnnouncementReceived for backward compatibility
  confirmAnnouncementReceived: announcementRecipientsService.confirmReceipt
};
