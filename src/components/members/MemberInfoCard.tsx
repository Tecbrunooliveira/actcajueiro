
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar, AlertCircle } from "lucide-react";
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
                    : "bg-amber-500"
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
        
        {/* Warnings Section */}
        {member.warnings && member.warnings.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium flex items-center mb-3">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Advertências
            </h3>
            <div className="space-y-3">
              {member.warnings.map((warning, index) => (
                <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{warning.text}</p>
                    <Badge variant="outline" className="ml-2 bg-white">
                      {new Date(warning.date).toLocaleDateString("pt-BR")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
