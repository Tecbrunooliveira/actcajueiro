
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import MemberForm from "./pages/MemberForm";
import Payments from "./pages/Payments";
import PaymentDetail from "./pages/PaymentDetail";
import PaymentForm from "./pages/PaymentForm";
import Reports from "./pages/Reports";
import Expenses from "./pages/Expenses";
import ExpenseDetail from "./pages/ExpenseDetail";
import ExpenseForm from "./pages/ExpenseForm";
import ExpenseCategories from "./pages/ExpenseCategories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:id" element={<MemberDetail />} />
        <Route path="/members/new" element={<MemberForm />} />
        <Route path="/members/edit/:id" element={<MemberForm />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/payments/:id" element={<PaymentDetail />} />
        <Route path="/payments/new" element={<PaymentForm />} />
        <Route path="/payments/edit/:id" element={<PaymentForm />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/:id" element={<ExpenseDetail />} />
        <Route path="/expenses/new" element={<ExpenseForm />} />
        <Route path="/expenses/edit/:id" element={<ExpenseForm />} />
        <Route path="/expense-categories" element={<ExpenseCategories />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
