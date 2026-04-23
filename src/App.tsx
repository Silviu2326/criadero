import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Layouts
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { MarketingLayout } from '@/components/layouts/MarketingLayout';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Dashboard Pages
import { DashboardPage } from '@/pages/DashboardPage';

// Kennel Pages
import { KennelsPage } from '@/pages/kennels/KennelsPage';
import { KennelDetailPage } from '@/pages/kennels/KennelDetailPage';
import { KennelCreatePage } from '@/pages/kennels/KennelCreatePage';

// Dog Pages
import { DogsPage } from '@/pages/dogs/DogsPage';
import { DogDetailPage } from '@/pages/dogs/DogDetailPage';
import { DogCreatePage } from '@/pages/dogs/DogCreatePage';
import { DogEditPage } from '@/pages/dogs/DogEditPage';

// Customer Pages
import { CustomersPage } from '@/pages/customers/CustomersPage';
import { CustomerDetailPage } from '@/pages/customers/CustomerDetailPage';
import { CustomerCreatePage } from '@/pages/customers/CustomerCreatePage';

// Reservation Pages
import { ReservationsPage } from '@/pages/reservations/ReservationsPage';
import { ReservationCreatePage } from '@/pages/reservations/ReservationCreatePage';

// Litter Pages
import { LittersPage } from '@/pages/litters/LittersPage';
import { LitterDetailPage } from '@/pages/litters/LitterDetailPage';
import { LitterCreatePage } from '@/pages/litters/LitterCreatePage';

// Medical Pages (Vet)
import { VetDashboardPage } from '@/pages/vet/VetDashboardPage';
import { MedicalRecordsPage } from '@/pages/vet/MedicalRecordsPage';
import { MedicalRecordCreatePage } from '@/pages/vet/MedicalRecordCreatePage';

// User Management (Manager)
import { UsersPage } from '@/pages/users/UsersPage';

// Reports
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { ClientReportsPage } from '@/pages/reports/ClientReportsPage';
import { ClientReportCreatePage } from '@/pages/reports/ClientReportCreatePage';
import { ClientReportDetailPage } from '@/pages/reports/ClientReportDetailPage';

// Calendar Pages
import { CalendarPage, CalendarEventsPage } from '@/pages/calendar';

// Documents Pages
import { DocumentsPage, PedigreesPage, ContractsPage, HealthCertsPage } from '@/pages/documents';

// Settings Pages
import { SettingsPage } from '@/pages/settings';

// Customer Portal Pages
import { AccountPage, MyDogsPage, MyDocumentsPage } from '@/pages/portal';

// Messages Pages
import { MessagesPage } from '@/pages/messages';

// Tasks Pages
import { TasksPage, TaskCreatePage } from '@/pages/tasks';

// Nutrition Pages
import {
  NutritionPage,
  NutritionPlansPage,
  NutritionPlanCreatePage,
  NutritionDailyLogPage,
  SupplementsPage,
  RecipesPage,
  RecipeCreatePage,
  RecipeDetailPage,
  IntolerancesPage,
  IntoleranceCreatePage,
  IntoleranceDetailPage,
  FeedingCostsPage,
} from '@/pages/nutrition';

// New modules pages
import {
  LogisticsPage,
  ShipmentCreatePage,
  CarriersPage,
  TrackingPage,
  LogisticsDocumentsPage,
  ShowsPage,
  ShowCreatePage,
  ShowDogsPage,
  ShowResultsPage,
  ShowBudgetPage,
  GeneticsPedigreePage,
  GeneticsCompatibilityPage,
  GeneticsTestsPage,
  GeneticsBreedingPlanPage,
  StaffPage,
  StaffSchedulePage,
  StaffPayrollPage,
  StaffTrainingPage,
  ReviewsPage,
  ReputationPage,
  VerificationPage,
} from '@/pages';

// Inspections pages
import { InspectionsPage, InspectionCreatePage, InspectionDetailPage } from '@/pages/inspections';

// Finance Pages
import { FinanceDashboardPage } from '@/pages/finance/FinanceDashboardPage';
import { TransactionsPage } from '@/pages/finance/TransactionsPage';
import { TransactionCreatePage } from '@/pages/finance/TransactionCreatePage';
import { InvoicesPage } from '@/pages/finance/InvoicesPage';
import { InvoiceCreatePage } from '@/pages/finance/InvoiceCreatePage';
import { InventoryPage } from '@/pages/finance/InventoryPage';
import { InventoryCreatePage } from '@/pages/finance/InventoryCreatePage';

// Public Pages
import { PublicKennelPage } from '@/pages/public/PublicKennelPage';

// Landing / Marketing Pages
import {
  HomePage,
  FeaturesPage,
  PricingPage,
  AboutPage,
  BlogIndexPage,
  GestionCriaderosArticle,
  HistorialVeterinarioArticle,
  RegistroCamadasArticle,
  SoftwareGestionPage,
  RegistroCamadasPage,
  PaginaWebCriadoresPage,
  ReservasCachorrosPage,
  MejorErpPage,
  ControlSanitarioPage,
  PedigreePage,
  AlimentacionCachorrosArticle,
  ContratoVentaArticle,
  MarketingDigitalArticle,
  NormativaEspanaArticle,
  CalendarioCelosArticle,
} from '@/pages/landing';

// Common
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user, isAuthenticated } = useAuth();

  // Get home route based on user role
  const getHomeRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'MANAGER':
        return '/dashboard';
      case 'BREEDER':
        return '/dashboard';
      case 'VETERINARIAN':
        return '/vet';
      case 'CUSTOMER':
        return '/account';
      default:
        return '/dashboard';
    }
  };

  return (
    <Routes>
      {/* Public Kennel Page */}
      <Route path="/k/:slug" element={<PublicKennelPage />} />

      {/* Landing / Marketing Routes */}
      <Route element={<MarketingLayout />}>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={getHomeRoute()} replace />
            ) : (
              <HomePage />
            )
          }
        />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/gestion-criaderos" element={<GestionCriaderosArticle />} />
        <Route path="/blog/historial-veterinario-perros" element={<HistorialVeterinarioArticle />} />
        <Route path="/blog/camadas-registro-profesional" element={<RegistroCamadasArticle />} />
        <Route path="/blog/alimentacion-cachorros" element={<AlimentacionCachorrosArticle />} />
        <Route path="/blog/contrato-venta-perros" element={<ContratoVentaArticle />} />
        <Route path="/blog/marketing-digital-criadores" element={<MarketingDigitalArticle />} />
        <Route path="/blog/normativa-espana-criadores" element={<NormativaEspanaArticle />} />
        <Route path="/blog/calendario-celos-perros" element={<CalendarioCelosArticle />} />
        <Route path="/software-gestion-criadores" element={<SoftwareGestionPage />} />
        <Route path="/registro-camadas" element={<RegistroCamadasPage />} />
        <Route path="/pagina-web-criadores" element={<PaginaWebCriadoresPage />} />
        <Route path="/reservas-cachorros" element={<ReservasCachorrosPage />} />
        <Route path="/mejor-erp-criadores" element={<MejorErpPage />} />
        <Route path="/control-sanitario" element={<ControlSanitarioPage />} />
        <Route path="/pedigree" element={<PedigreePage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'BREEDER', 'VETERINARIAN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Common Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Kennels */}
        <Route path="/kennels" element={<KennelsPage />} />
        <Route path="/kennels/create" element={<KennelCreatePage />} />
        <Route path="/kennels/:id" element={<KennelDetailPage />} />

        {/* Dogs */}
        <Route path="/dogs" element={<DogsPage />} />
        <Route path="/dogs/create" element={<DogCreatePage />} />
        <Route path="/dogs/:id" element={<DogDetailPage />} />
        <Route path="/dogs/:id/edit" element={<DogEditPage />} />

        {/* Customers */}
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/create" element={<CustomerCreatePage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />

        {/* Reservations */}
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/reservations/create" element={<ReservationCreatePage />} />

        {/* Tasks */}
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/create" element={<TaskCreatePage />} />

        {/* Nutrition */}
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/nutrition/plans" element={<NutritionPlansPage />} />
        <Route path="/nutrition/plans/new" element={<NutritionPlanCreatePage />} />
        <Route path="/nutrition/daily-log" element={<NutritionDailyLogPage />} />
        <Route path="/nutrition/supplements" element={<SupplementsPage />} />
        <Route path="/nutrition/recipes" element={<RecipesPage />} />
        <Route path="/nutrition/recipes/new" element={<RecipeCreatePage />} />
        <Route path="/nutrition/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/nutrition/intolerances" element={<IntolerancesPage />} />
        <Route path="/nutrition/intolerances/new" element={<IntoleranceCreatePage />} />
        <Route path="/nutrition/intolerances/:id" element={<IntoleranceDetailPage />} />
        <Route path="/nutrition/feeding-costs" element={<FeedingCostsPage />} />

        {/* Litters */}
        <Route path="/litters" element={<LittersPage />} />
        <Route path="/litters/create" element={<LitterCreatePage />} />
        <Route path="/litters/:id" element={<LitterDetailPage />} />

        {/* Logistics */}
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/logistics/shipments/new" element={<ShipmentCreatePage />} />
        <Route path="/logistics/carriers" element={<CarriersPage />} />
        <Route path="/logistics/tracking" element={<TrackingPage />} />
        <Route path="/logistics/documents" element={<LogisticsDocumentsPage />} />

        {/* Shows */}
        <Route path="/shows" element={<ShowsPage />} />
        <Route path="/shows/create" element={<ShowCreatePage />} />
        <Route path="/shows/dogs" element={<ShowDogsPage />} />
        <Route path="/shows/results" element={<ShowResultsPage />} />
        <Route path="/shows/budget" element={<ShowBudgetPage />} />

        {/* Genetics */}
        <Route path="/genetics/pedigree" element={<GeneticsPedigreePage />} />
        <Route path="/genetics/compatibility" element={<GeneticsCompatibilityPage />} />
        <Route path="/genetics/tests" element={<GeneticsTestsPage />} />
        <Route path="/genetics/breeding-plan" element={<GeneticsBreedingPlanPage />} />

        {/* Staff */}
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/staff/schedule" element={<StaffSchedulePage />} />
        <Route path="/staff/payroll" element={<StaffPayrollPage />} />
        <Route path="/staff/training" element={<StaffTrainingPage />} />

        {/* Reviews & Reputation */}
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/reputation" element={<ReputationPage />} />
        <Route path="/verification" element={<VerificationPage />} />

        {/* Inspections */}
        <Route path="/inspections" element={<InspectionsPage />} />
        <Route path="/inspections/create" element={<InspectionCreatePage />} />
        <Route path="/inspections/:id" element={<InspectionDetailPage />} />

        {/* Reports */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/client" element={<ClientReportsPage />} />
        <Route path="/reports/client/new" element={<ClientReportCreatePage />} />
        <Route path="/reports/client/:id" element={<ClientReportDetailPage />} />

        {/* Calendar */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/events" element={<CalendarEventsPage />} />
        {/* Documents */}
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/documents/pedigrees" element={<PedigreesPage />} />
        <Route path="/documents/contracts" element={<ContractsPage />} />
        <Route path="/documents/health" element={<HealthCertsPage />} />

        {/* Finance */}
        <Route path="/finance" element={<FinanceDashboardPage />} />
        <Route path="/finance/transactions" element={<TransactionsPage />} />
        <Route path="/finance/transactions/new" element={<TransactionCreatePage />} />
        <Route path="/finance/invoices" element={<InvoicesPage />} />
        <Route path="/finance/invoices/new" element={<InvoiceCreatePage />} />
        <Route path="/finance/inventory" element={<InventoryPage />} />
        <Route path="/finance/inventory/new" element={<InventoryCreatePage />} />
      </Route>

      {/* Vet Only Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['VETERINARIAN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/vet" element={<VetDashboardPage />} />
        <Route path="/vet/records" element={<MedicalRecordsPage />} />
        <Route path="/vet/records/create" element={<MedicalRecordCreatePage />} />
      </Route>

      {/* Manager Only Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/users" element={<UsersPage />} />
      </Route>

      {/* Common Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/profile" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Customer Portal */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/my-dogs" element={<MyDogsPage />} />
        <Route path="/my-documents" element={<MyDocumentsPage />} />

        {/* Messages */}
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:userId" element={<MessagesPage />} />
      </Route>

      {/* Default Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
