
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { useNavigate, useParams } from "react-router-dom";
import { expenseService } from "@/services/expense";
import { Expense, ExpenseCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ExpenseFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expense, setExpense] = useState<Expense | undefined>(undefined);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await expenseService.getAllCategories();
        setCategories(categoriesData);

        if (id) {
          const expenseData = await expenseService.getExpenseById(id);
          if (expenseData) {
            setExpense(expenseData);
          } else {
            toast({
              title: "Erro",
              description: "Despesa não encontrada.",
              variant: "destructive",
            });
            navigate("/expenses");
          }
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: Omit<Expense, "id">) => {
    try {
      if (id) {
        await expenseService.updateExpense({
          ...data,
          id,
        });
        toast({
          title: "Sucesso",
          description: "Despesa atualizada com sucesso!",
        });
      } else {
        await expenseService.createExpense(data);
        toast({
          title: "Sucesso",
          description: "Despesa criada com sucesso!",
        });
      }
      navigate("/expenses");
    } catch (error) {
      toast({
        title: "Erro",
        description: `Não foi possível ${id ? "atualizar" : "criar"} a despesa.`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  if (isLoading) {
    return (
      <MobileLayout title={id ? "Editar Despesa" : "Nova Despesa"}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={id ? "Editar Despesa" : "Nova Despesa"}>
      <div className="space-y-6">
        <div className="border rounded-lg p-4 bg-white">
          <ExpenseForm
            onSubmit={handleSubmit}
            initialData={expense}
            onCancel={handleCancel}
            categories={categories}
          />
        </div>
      </div>
    </MobileLayout>
  );
};

export default ExpenseFormPage;
