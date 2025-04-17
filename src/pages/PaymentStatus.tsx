
import React, { useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface PaymentStatusProps {
  status: "success" | "failure" | "pending";
}

const PaymentStatus = ({ status }: PaymentStatusProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const displayStatus = () => {
      if (status === "success") {
        toast.success("Pagamento aprovado com sucesso!");
      } else if (status === "failure") {
        toast.error("Houve um problema com o pagamento");
      } else if (status === "pending") {
        toast.info("Pagamento em processamento");
      }
    };

    displayStatus();
  }, [status]);

  return (
    <MobileLayout
      title="Status do Pagamento"
      onBackClick={() => navigate("/payments")}
    >
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        {status === "success" && (
          <>
            <CheckCircle className="w-20 h-20 text-green-500" />
            <h2 className="text-2xl font-semibold text-green-700">Pagamento Aprovado</h2>
            <p className="text-center text-gray-600">
              Seu pagamento foi processado com sucesso!
            </p>
          </>
        )}

        {status === "failure" && (
          <>
            <XCircle className="w-20 h-20 text-red-500" />
            <h2 className="text-2xl font-semibold text-red-700">Pagamento Recusado</h2>
            <p className="text-center text-gray-600">
              Houve um problema com o seu pagamento. Por favor, tente novamente.
            </p>
          </>
        )}

        {status === "pending" && (
          <>
            <Clock className="w-20 h-20 text-yellow-500" />
            <h2 className="text-2xl font-semibold text-yellow-700">Pagamento Pendente</h2>
            <p className="text-center text-gray-600">
              Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
            </p>
          </>
        )}

        <div className="flex gap-4 w-full max-w-xs">
          <Button
            onClick={() => navigate("/payments")}
            className="flex-1"
          >
            Ver Pagamentos
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex-1"
          >
            Página Inicial
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PaymentStatus;
