
import React from "react";
import { Link } from "react-router-dom";
import { Member } from "@/types";
import { getStatusColor, getStatusLabel } from "@/services/dataService";
import { ChevronRight, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link
      to={`/members/${member.id}`}
      className="block bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow"
    >
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
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{member.phone}</span>
          </div>
        )}
        {member.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span>{member.email}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
