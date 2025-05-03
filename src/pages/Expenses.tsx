import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { expenseService } from "@/services/expense";
import { Expense, ExpenseCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/services/formatters";
import { Plus, CreditCard, Tag, Calendar, TrendingUp, TrendingDown, History } from "lucide-react";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
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

  // Filtro de lançamentos do mês atual
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const filteredExpenses = showAll
    ? expenses
    : expenses.filter((e) => {
        const date = new Date(e.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

  return (
    <MobileLayout title="Despesas e Receitas">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Despesas e Receitas</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex gap-2 flex-1">
              <Button asChild variant="default" className="w-full sm:w-auto">
                <Link to="/expenses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Lançamento
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/expense-categories">
                  <Tag className="h-4 w-4 mr-2" />
                  Categorias
                </Link>
              </Button>
            </div>
            <Button
              variant={showAll ? "secondary" : "ghost"}
              className={`flex items-center mt-2 sm:mt-0 sm:ml-2 border ${showAll ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200"}`}
              size="sm"
              onClick={() => setShowAll((v) => !v)}
            >
              <History className="h-4 w-4 mr-1" />
              {showAll ? "Mostrar apenas mês atual" : "Buscar lançamentos anteriores"}
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-6 text-center border rounded-lg bg-gray-50">
            <p className="text-muted-foreground">
              Nenhum lançamento registrado. Adicione uma nova receita ou despesa para começar.
            </p>
            <Button asChild className="mt-4">
              <Link to="/expenses/new">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Lançamento
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
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
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${expense.type === "receita" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {expense.type === "receita" ? "Receita" : "Despesa"}
                          </span>
                        </div>
                        <h3 className="font-medium">{expense.description}</h3>
                      </div>
                      <p className={`font-semibold text-lg ${expense.type === "receita" ? "text-green-600" : "text-red-600"}`}>
                        {expense.type === "receita" ? <TrendingUp className="inline h-4 w-4 mr-1" /> : <TrendingDown className="inline h-4 w-4 mr-1" />}
                        {formatCurrency(expense.amount)}
                      </p>
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
