
import { recipientsBaseService } from "./recipients/recipientsBaseService";
import { confirmationService } from "./recipients/confirmationService";

export const announcementRecipientsService = {
  addRecipients: recipientsBaseService.addRecipients,
  confirmReceipt: confirmationService.confirmReceipt
};
