
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { Member } from "@/types";
import { getStatusLabel } from "@/services/formatters";
import { cn } from "@/lib/utils";

interface MemberInfoCardProps {
  member: Member;
}

export function MemberInfoCard({ member }: MemberInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.photo} alt={member.name} />
            <AvatarFallback className="bg-gray-200">
              <User className="h-8 w-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <Badge
                className={cn(
                  "ml-2",
                  member.status === "frequentante"
                    ? "bg-green-500"
                    : member.status === "afastado"
                    ? "bg-amber-500"
                    : "bg-red-500"
                )}
              >
                {getStatusLabel(member.status)}
              </Badge>
            </div>

            <div className="space-y-3 mt-2">
              {member.email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{member.email}</span>
                </div>
              )}

              {member.phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
              )}

              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <span>
                  Associado desde{" "}
                  {new Date(member.joinDate).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {member.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-gray-700 text-sm">
            {member.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
