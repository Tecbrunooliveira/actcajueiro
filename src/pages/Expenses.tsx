
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { expenseService } from "@/services/expenseService";
import { Expense, ExpenseCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/services/formatters";
import { Plus, CreditCard, Tag, Calendar } from "lucide-react";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [expensesData, categoriesData] = await Promise.all([
          expenseService.getAllExpenses(),
          expenseService.getAllCategories(),
        ]);
        setExpenses(expensesData);
        setCategories(categoriesData);
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

    fetchData();
  }, [toast]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Sem categoria";
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#3b82f6";
  };

  return (
    <MobileLayout title="Despesas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Despesas</h2>
          <div className="space-x-2">
            <Button asChild variant="outline">
              <Link to="/expense-categories">
                <Tag className="h-4 w-4 mr-2" />
                Categorias
              </Link>
            </Button>
            <Button asChild>
              <Link to="/expenses/new">
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-6 text-center border rounded-lg bg-gray-50">
            <p className="text-muted-foreground">
              Nenhuma despesa registrada. Adicione uma nova despesa para começar.
            </p>
            <Button asChild className="mt-4">
              <Link to="/expenses/new">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Despesa
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <Link to={`/expenses/${expense.id}`} key={expense.id}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                          />
                          <p className="text-sm text-muted-foreground">
                            {getCategoryName(expense.categoryId)}
                          </p>
                        </div>
                        <h3 className="font-medium">{expense.description}</h3>
                      </div>
                      <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                    </div>
                    <div className="flex mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </div>
                      {expense.paymentMethod && (
                        <div className="flex items-center">
                          <CreditCard className="h-3 w-3 mr-1" />
                          {expense.paymentMethod}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Expenses;
