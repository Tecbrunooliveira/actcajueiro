
export const logDebug = {
  memberFound: (memberId: string, name: string) => {
    console.log(`Found member ID: ${memberId} Name: ${name}`);
  },
  
  startingCheck: () => {
    console.log("Starting getMyAnnouncements");
  },
  
  userAuthenticated: (userId: string, email: string) => {
    console.log(`Authenticated user ID: ${userId} Email: ${email}`);
  },
  
  gettingMemberId: (userId: string) => {
    console.log(`Getting member ID for user: ${userId}`);
  },
  
  noMemberData: () => {
    console.error("No member data found for user. The user is not associated with any member in the members table.");
  },
  
  announcements: {
    total: (count: number) => {
      console.log(`All announcements in DB: ${count}`);
    },
    
    none: () => {
      console.log("⚠️ No announcements found in the database at all. Please create some announcements first.");
    },
    
    details: (announcements: any[]) => {
      if (announcements && announcements.length > 0) {
        console.log("All announcement IDs in database:", announcements.map(a => a.id));
        announcements.forEach(a => {
          console.log(`DB announcement: ${a.id} - ${a.title} - created by: ${a.created_by}`);
        });
      }
    }
  },
  
  recipients: {
    total: (count: number) => {
      console.log(`All announcement recipients for member: ${count}`);
    },
    
    records: (recipients: any[]) => {
      console.log("Recipient records:", recipients.map(r => ({
        id: r.id,
        announcement_id: r.announcement_id,
        read_at: r.read_at
      })));
    },
    
    unread: (count: number) => {
      console.log(`Unread announcement recipients: ${count}`);
    },
    
    allRead: () => {
      console.log("No unread announcements for this member - all announcements have already been marked as read");
    }
  },
  
  orphanedCleanup: {
    start: () => {
      console.log("Starting cleanup of orphaned recipient records");
    },
    
    noAnnouncements: () => {
      console.log("No announcements found in the database - will mark all recipients as read");
    },
    
    success: () => {
      console.log("Successfully cleaned up orphaned recipient records");
    },
    
    error: (error: any) => {
      console.error("Error during orphaned recipient cleanup:", error);
    }
  }
};
