
// This is a compatibility layer file for older code
import { 
  announcementService, 
  announcementBaseService,
  announcementRecipientsService,
  announcementQueryService
} from './announcement';

export const {
  createAnnouncement,
  getMyAnnouncements,
  confirmAnnouncementReceived
} = announcementService;

export default announcementService;
