
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ExpenseCategory } from "@/types";
import { expenseService } from "@/services/expenseService";
import { CategoryForm } from "@/components/expenses/CategoryForm";
import { CategoryCard } from "@/components/expenses/CategoryCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

const ExpenseCategories = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await expenseService.getAllCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData: Omit<ExpenseCategory, "id">) => {
    try {
      const newCategory = await expenseService.createCategory(categoryData);
      if (newCategory) {
        setCategories((prev) => [...prev, newCategory]);
        setShowForm(false);
        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a categoria.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (categoryData: Omit<ExpenseCategory, "id">) => {
    if (!editingCategory) return;
    
    try {
      const updatedCategory = await expenseService.updateCategory({
        ...categoryData,
        id: editingCategory.id,
      });
      
      if (updatedCategory) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
        );
        setEditingCategory(null);
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a categoria.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      const success = await expenseService.deleteCategory(categoryToDelete);
      if (success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete));
        setCategoryToDelete(null);
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria.",
        variant: "destructive",
      });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <MobileLayout title="Categorias de Despesas">
      <div className="space-y-6">
        {!showForm ? (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categorias</h2>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="p-6 text-center border rounded-lg bg-gray-50">
                <p className="text-muted-foreground">
                  Nenhuma categoria encontrada. Crie uma nova categoria para começar.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={handleEditCategory}
                    onDelete={(id) => setCategoryToDelete(id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="border rounded-lg p-4 bg-white">
            <CategoryForm
              onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
              initialData={editingCategory || undefined}
              onCancel={handleCancelForm}
            />
          </div>
        )}
      </div>

      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
};

export default ExpenseCategories;
