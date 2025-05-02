
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const PhotoUpload = ({ value, onChange }: PhotoUploadProps) => {
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <Label htmlFor="photo" className="self-start">Foto de Perfil</Label>
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-24 w-24">
          <AvatarImage src={value} />
          <AvatarFallback className="bg-gray-200">
            <User className="h-12 w-12 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex gap-2">
          <Label 
            htmlFor="photo-upload" 
            className="cursor-pointer py-1 px-3 text-sm bg-club-500 text-white rounded-md hover:bg-club-600 transition-colors"
          >
            {loading ? "Carregando..." : "Escolher foto"}
          </Label>
          
          {value && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleRemoveImage}
              className="text-sm"
            >
              Remover
            </Button>
          )}
        </div>
        
        <Input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
