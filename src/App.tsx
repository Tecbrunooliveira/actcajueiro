import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PaymentStatus from "./pages/PaymentStatus";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Add route for user profile */}
          <Route path="/me" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
          <Route path="/members/:id" element={<ProtectedRoute><MemberDetail /></ProtectedRoute>} />
          <Route path="/members/new" element={<ProtectedRoute><MemberForm /></ProtectedRoute>} />
          <Route path="/members/edit/:id" element={<ProtectedRoute><MemberForm /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/payments/:id" element={<ProtectedRoute><PaymentDetail /></ProtectedRoute>} />
          <Route path="/payments/new" element={<ProtectedRoute><PaymentForm /></ProtectedRoute>} />
          <Route path="/payments/edit/:id" element={<ProtectedRoute><PaymentForm /></ProtectedRoute>} />
          <Route path="/payments/success" element={<ProtectedRoute><PaymentStatus status="success" /></ProtectedRoute>} />
          <Route path="/payments/failure" element={<ProtectedRoute><PaymentStatus status="failure" /></ProtectedRoute>} />
          <Route path="/payments/pending" element={<ProtectedRoute><PaymentStatus status="pending" /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/expenses/:id" element={<ProtectedRoute><ExpenseDetail /></ProtectedRoute>} />
          <Route path="/expenses/new" element={<ProtectedRoute><ExpenseForm /></ProtectedRoute>} />
          <Route path="/expenses/edit/:id" element={<ProtectedRoute><ExpenseForm /></ProtectedRoute>} />
          <Route path="/expense-categories" element={<ProtectedRoute><ExpenseCategories /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
