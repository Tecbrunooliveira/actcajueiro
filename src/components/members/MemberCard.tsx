
import React from "react";
import { Link } from "react-router-dom";
import { Member } from "@/types";
import { getStatusColor, getStatusLabel } from "@/services/formatters";
import { ChevronRight, Phone, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/services/communicationService";

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to member detail
    if (member.phone) {
      openWhatsApp(member.phone);
    }
  };

  return (
    <Link
      to={`/members/${member.id}`}
      className="block bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.photo} alt={member.name} />
          <AvatarFallback className="bg-gray-200">
            <User className="h-5 w-5 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{member.name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    getStatusColor(member.status)
                  )}
                ></span>
                <span className="text-sm text-gray-600">
                  {getStatusLabel(member.status)}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="mt-3 space-y-1">
            {member.phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{member.phone}</span>
                </div>
                <Button 
                  size="sm" 
                  className="h-8 bg-green-500 hover:bg-green-600"
                  onClick={handleWhatsAppClick}
                >
                  WhatsApp
                </Button>
              </div>
            )}
            {member.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{member.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
