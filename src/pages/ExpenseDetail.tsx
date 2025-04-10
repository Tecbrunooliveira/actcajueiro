
import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { expenseService } from "@/services/expenseService";
import { Expense, ExpenseCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/services/formatters";
import { Pencil, Trash2, CreditCard, Calendar, Tag, ArrowLeft } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const ExpenseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadExpense = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const expenseData = await expenseService.getExpenseById(id);
        if (expenseData) {
          setExpense(expenseData);
          
          // Carregar a categoria
          if (expenseData.categoryId) {
            const categoryData = await expenseService.getCategoryById(expenseData.categoryId);
            if (categoryData) {
              setCategory(categoryData);
            }
          }
        } else {
          toast({
            title: "Erro",
            description: "Despesa não encontrada.",
            variant: "destructive",
          });
          navigate("/expenses");
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da despesa.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadExpense();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await expenseService.deleteExpense(id);
      toast({
        title: "Sucesso",
        description: "Despesa excluída com sucesso!",
      });
      navigate("/expenses");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a despesa.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MobileLayout title="Detalhes da Despesa">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  if (!expense) {
    return (
      <MobileLayout title="Detalhes da Despesa">
        <div className="text-center p-6">
          <p>Despesa não encontrada.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate("/expenses")}
          >
            Voltar para Despesas
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Detalhes da Despesa">
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/expenses")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> 
            Voltar
          </Button>
          <div className="flex-1" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/expenses/edit/${expense.id}`)}
            className="mr-2"
          >
            <Pencil className="h-4 w-4 mr-1" /> 
            Editar
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> 
            Excluir
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">{expense.description}</h2>
                <span className="text-xl font-bold">{formatCurrency(expense.amount)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data</p>
                    <p>{new Date(expense.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Categoria</p>
                    <div className="flex items-center">
                      {category && (
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: category.color || '#3b82f6' }}
                        />
                      )}
                      <p>{category?.name || "Sem categoria"}</p>
                    </div>
                  </div>
                </div>

                {expense.paymentMethod && (
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Método de Pagamento</p>
                      <p>{expense.paymentMethod}</p>
                    </div>
                  </div>
                )}
              </div>

              {expense.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Observações</p>
                  <p className="text-muted-foreground">{expense.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
};

export default ExpenseDetail;
