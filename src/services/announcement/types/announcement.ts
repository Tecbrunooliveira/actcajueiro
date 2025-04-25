
export type CreateAnnouncementParams = {
  title: string;
  content: string;
  is_global: boolean;
  memberIds?: string[];
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  is_global: boolean;
  created_by: string;
  created_at: string;
};
