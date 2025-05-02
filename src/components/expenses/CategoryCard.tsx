
import React from "react";
import { ExpenseCategory } from "@/types";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type CategoryCardProps = {
  category: ExpenseCategory;
  onEdit: (category: ExpenseCategory) => void;
  onDelete: (id: string) => void;
};

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: category.color || "#3b82f6" }}
          />
          <h3 className="font-semibold text-lg flex-1">{category.name}</h3>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {category.description && (
          <p className="text-sm text-muted-foreground">{category.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onEdit(category)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(category.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
