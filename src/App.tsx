
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/auth";
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
import AdminUsers from "./pages/AdminUsers";
import AnnouncementAdmin from "./pages/AnnouncementAdmin";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <NotFound />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route path="/me" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
          <Route path="/members/:id" element={<ProtectedRoute><MemberDetail /></ProtectedRoute>} />
          <Route path="/members/new" element={<ProtectedRoute><MemberForm /></ProtectedRoute>} />
          <Route path="/members/edit/:id" element={<ProtectedRoute><MemberForm /></ProtectedRoute>} />

          <Route path="/payments" element={<ProtectedRoute><AdminRoute><Payments /></AdminRoute></ProtectedRoute>} />
          <Route path="/payments/:id" element={<ProtectedRoute><AdminRoute><PaymentDetail /></AdminRoute></ProtectedRoute>} />
          <Route path="/payments/new" element={<ProtectedRoute><AdminRoute><PaymentForm /></AdminRoute></ProtectedRoute>} />
          <Route path="/payments/edit/:id" element={<ProtectedRoute><AdminRoute><PaymentForm /></AdminRoute></ProtectedRoute>} />
          <Route path="/payments/success" element={<ProtectedRoute><AdminRoute><PaymentStatus status="success" /></AdminRoute></ProtectedRoute>} />
          <Route path="/payments/failure" element={<ProtectedRoute><AdminRoute><PaymentStatus status="failure" /></AdminRoute></ProtectedRoute>} />
          <Route path="/payments/pending" element={<ProtectedRoute><AdminRoute><PaymentStatus status="pending" /></AdminRoute></ProtectedRoute>} />

          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><AdminRoute><Expenses /></AdminRoute></ProtectedRoute>} />
          <Route path="/expenses/:id" element={<ProtectedRoute><AdminRoute><ExpenseDetail /></AdminRoute></ProtectedRoute>} />
          <Route path="/expenses/new" element={<ProtectedRoute><AdminRoute><ExpenseForm /></AdminRoute></ProtectedRoute>} />
          <Route path="/expenses/edit/:id" element={<ProtectedRoute><AdminRoute><ExpenseForm /></AdminRoute></ProtectedRoute>} />
          <Route path="/expense-categories" element={<ProtectedRoute><AdminRoute><ExpenseCategories /></AdminRoute></ProtectedRoute>} />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AnnouncementAdmin />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
