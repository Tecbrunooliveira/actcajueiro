import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar, AlertCircle } from "lucide-react";
import { Member } from "@/types";
import { getStatusLabel } from "@/services/formatters";
import { cn } from "@/lib/utils";
import { StarRatingInput } from "./StarRatingInput";

interface MemberInfoCardProps {
  member: Member;
}

export function MemberInfoCard({ member }: MemberInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-4 mb-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
            <AvatarImage src={member.photo} alt={member.name} />
            <AvatarFallback className="bg-gray-200">
              <User className="h-8 w-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold break-words">{member.name}</h2>
                {/* Exibe posição em destaque */}
                {member.position?.name && (
                  <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{member.position.name}</div>
                )}
                {/* Exibe nível em estrelas */}
                {typeof member.level === "number" && (
                  <div className="flex items-center mt-1">
                    <StarRatingInput value={member.level} onChange={() => {}} readOnly />
                    <span className="ml-2 text-xs sm:text-sm text-yellow-800">{member.level}/5</span>
                  </div>
                )}
              </div>
              <Badge
                className={cn(
                  "mt-2 sm:mt-0 ml-0 sm:ml-2 w-fit",
                  member.status === "frequentante"
                    ? "bg-green-500"
                    : "bg-amber-500"
                )}
              >
                {getStatusLabel(member.status)}
              </Badge>
            </div>

            <div className="space-y-2 sm:space-y-3 mt-2">
              {member.email && (
                <div className="flex items-center text-gray-700 break-all">
                  <Mail className="h-5 w-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-base">{member.email}</span>
                </div>
              )}

              {member.phone && (
                <div className="flex items-center text-gray-700 break-all">
                  <Phone className="h-5 w-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-base">{member.phone}</span>
                </div>
              )}

              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-base">
                  Associado desde {new Date(member.joinDate).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {member.notes && (
          <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-md text-gray-700 text-xs sm:text-sm">
            {member.notes}
          </div>
        )}

        {/* Warnings Section */}
        {member.warnings && member.warnings.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <h3 className="text-base sm:text-lg font-medium flex items-center mb-2 sm:mb-3">
              <AlertCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              Advertências
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {member.warnings.map((warning, index) => (
                <div key={index} className="p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-xs sm:text-sm">{warning.text}</p>
                    <Badge variant="outline" className="ml-2 bg-white text-xs sm:text-sm">
                      {warning.date.length === 10 ? warning.date.split('-').reverse().join('/') : new Date(warning.date).toLocaleDateString("pt-BR")}
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
