// Enums
export type UserRole = 'MANAGER' | 'BREEDER' | 'VETERINARIAN' | 'CUSTOMER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type DogStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'REPRODUCTIVE' | 'RETIRED';
export type DogVisibility = 'PUBLIC' | 'PRIVATE';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type KennelStatus = 'ACTIVE' | 'INACTIVE';
export type MedicalRecordType = 'VACCINE' | 'DEWORMING' | 'CONSULTATION' | 'EXAM' | 'SURGERY' | 'OTHER';
export type Gender = 'MALE' | 'FEMALE';
export type CalendarEventType = 'VACCINE' | 'DEWORMING' | 'HEAT' | 'BIRTH' | 'APPOINTMENT' | 'OTHER';
export type CalendarEventStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Kennel types
export interface Kennel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  status: KennelStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  breeder?: User;
  _count?: {
    dogs: number;
    customers: number;
  };
}

// Breed types
export interface Breed {
  id: string;
  name: string;
  group?: string;
  description?: string;
  origin?: string;
  isActive: boolean;
}

// Dog types
export interface DogPhoto {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
}

export interface Dog {
  id: string;
  name: string;
  breedId: string;
  breed?: Breed;
  gender: Gender;
  birthDate: string;
  color?: string;
  microchip?: string;
  pedigree?: string;
  status: DogStatus;
  visibility: DogVisibility;
  internalNotes?: string;
  price?: number;
  kennelId: string;
  kennel?: Kennel;
  fatherId?: string;
  father?: Dog;
  motherId?: string;
  mother?: Dog;
  photos: DogPhoto[];
  medicalRecords?: MedicalRecord[];
  reservations?: Reservation[];
  childrenFather?: Dog[];
  childrenMother?: Dog[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    medicalRecords: number;
    reservations: number;
  };
}

// Medical Record types
export interface MedicalRecord {
  id: string;
  type: MedicalRecordType;
  date: string;
  description: string;
  nextDate?: string;
  attachmentUrl?: string;
  createdAt: string;
  dogId: string;
  dog?: Dog;
  vetId: string;
  vet?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  vaccineName?: string;
  vaccineLot?: string;
  vaccineLab?: string;
  dewormerProduct?: string;
  weightAtDate?: number;
  diagnosis?: string;
  treatment?: string;
  postOpNotes?: string;
}

// Customer types
export interface Customer {
  id: string;
  userId?: string;
  kennelId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  notes?: string;
  isArchived: boolean;
  createdAt: string;
  user?: User;
  reservations?: Reservation[];
  _count?: {
    reservations: number;
  };
}

// Reservation types
export interface Reservation {
  id: string;
  status: ReservationStatus;
  amount?: number;
  deposit?: number;
  notes?: string;
  requestMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  kennelId: string;
  kennel?: Kennel;
  dogId: string;
  dog?: Dog;
  customerId: string;
  customer?: Customer;
  userId?: string;
  user?: User;
}

// Litter types
export interface LitterPuppy {
  id: string;
  name?: string;
  gender?: Gender;
  color?: string;
  microchip?: string;
  status: DogStatus;
  notes?: string;
  litterId: string;
  dogId?: string;
  dog?: Dog;
}

export interface Litter {
  id: string;
  birthDate: string;
  puppyCount: number;
  deadPuppies: number;
  notes?: string;
  kennelId: string;
  kennel?: Kennel;
  fatherId: string;
  father?: Dog;
  motherId: string;
  mother?: Dog;
  puppies: LitterPuppy[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    puppies: number;
  };
}

// Veterinarian types
export interface Veterinarian {
  id: string;
  userId: string;
  user?: User;
  license?: string;
  specialization?: string;
  kennels: { kennel: Kennel }[];
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Stats types
export interface KennelStats {
  stats: {
    dogs: { status: DogStatus; _count: { status: number } }[];
    customers: { isArchived: boolean; _count: { isArchived: number } }[];
    reservations: { status: ReservationStatus; _count: { status: number } }[];
    upcomingVaccines: number;
  };
}

export interface DashboardStats {
  totalKennels: number;
  totalDogs: number;
  totalUsers: number;
  totalCustomers: number;
  totalReservations: number;
}

// Calendar Event types
export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string;
  endDate?: string;
  allDay: boolean;
  reminderDays: number;
  status: CalendarEventStatus;
  notes?: string;
  location?: string;
  kennelId: string;
  kennel?: {
    id: string;
    name: string;
  };
  dogId?: string;
  dog?: {
    id: string;
    name: string;
    breed?: { name: string };
    photos?: { url: string }[];
  };
  customerId?: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  litterId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarEventData {
  title: string;
  type: CalendarEventType;
  date: string;
  endDate?: string;
  allDay?: boolean;
  reminderDays?: number;
  notes?: string;
  location?: string;
  kennelId: string;
  dogId?: string;
  customerId?: string;
  litterId?: string;
  status?: CalendarEventStatus;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string;
  recurrenceRule?: string;
  isTemplate: boolean;
  kennelId: string;
  kennel?: { id: string; name: string };
  createdBy: string;
  creator?: { id: string; firstName: string; lastName: string };
  assignedTo?: string;
  assignee?: { id: string; firstName: string; lastName: string };
  dogId?: string;
  dog?: { id: string; name: string; breed?: { name: string }; photos?: { url: string }[] };
  customerId?: string;
  customer?: { id: string; firstName: string; lastName: string; email?: string };
  litterId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
}

// Document types
export type DocumentType = 'PEDIGREE' | 'CONTRACT' | 'HEALTH_CERT' | 'VACCINE_CERT' | 'MICROCHIP' | 'PHOTO' | 'INVOICE' | 'OTHER';
export type DocumentStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  description?: string;
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  isPublic: boolean;
  tags?: string;
  issuedDate?: string;
  expiryDate?: string;
  status: DocumentStatus;
  version: number;
  metadata?: string;
  kennelId: string;
  kennel?: {
    id: string;
    name: string;
  };
  dogId?: string;
  dog?: {
    id: string;
    name: string;
    breed?: { name: string };
    photos?: { url: string }[];
  };
  customerId?: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  fatherDogId?: string;
  motherDogId?: string;
  contractData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  variables?: string;
  isDefault: boolean;
  isActive: boolean;
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentData {
  name: string;
  type: DocumentType;
  description?: string;
  dogId?: string;
  customerId?: string;
  kennelId: string;
  tags?: string;
  issuedDate?: string;
  expiryDate?: string;
}

export interface GenerateContractData {
  kennelId: string;
  customerId?: string;
  dogId?: string;
  contractType?: string;
  price?: number;
  deposit?: number;
  terms?: string;
  templateId?: string;
}

export interface GeneratePedigreeData {
  dogId: string;
  kennelId: string;
}

// Nutrition types
export type DietType = 'DRY' | 'WET' | 'BARF' | 'HOME_COOKED' | 'MIXED';
export type ActivityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
export type NutritionStage = 'PUPPY' | 'ADULT' | 'SENIOR';

export interface NutritionPlan {
  id: string;
  name: string;
  dietType: DietType;
  targetBreedId?: string;
  targetBreed?: Breed;
  minAgeMonths?: number;
  maxAgeMonths?: number;
  minWeightKg?: number;
  maxWeightKg?: number;
  activityLevel: ActivityLevel;
  dailyGramsPerKg: number;
  instructions?: string;
  isActive: boolean;
  kennelId: string;
  kennel?: Kennel;
  createdAt: string;
  updatedAt: string;
  _count?: { dogDiets: number };
}

export interface DogNutrition {
  id: string;
  dogId: string;
  dog?: Dog;
  planId: string;
  plan?: NutritionPlan;
  startDate: string;
  endDate?: string;
  currentWeightKg: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionLog {
  id: string;
  dogId: string;
  dog?: Dog;
  planId: string;
  plan?: NutritionPlan;
  date: string;
  gramsServed: number;
  gramsLeftovers: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplement {
  id: string;
  dogId: string;
  dog?: Dog;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit?: number;
  notes?: string;
  recipeId: string;
  inventoryItemId?: string;
  inventoryItem?: { id: string; name: string; cost?: number; unit: string };
}

export interface Recipe {
  id: string;
  name: string;
  dietType: DietType;
  portions: number;
  instructions?: string;
  notes?: string;
  isActive: boolean;
  kennelId: string;
  kennel?: Kennel;
  ingredients: RecipeIngredient[];
  dogDiets?: DogNutrition[];
  createdAt: string;
  updatedAt: string;
  _count?: { dogDiets: number };
}

export interface FoodIntolerance {
  id: string;
  dogId: string;
  dog?: Dog;
  foodName: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  symptoms?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { reactions: number };
}

export interface IntoleranceReaction {
  id: string;
  intoleranceId: string;
  date: string;
  symptoms: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  notes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedingCost {
  dogId: string;
  dogName: string;
  dogPhoto?: string;
  breed?: string;
  weightKg: number | null;
  totalGramsServed: number;
  totalGramsConsumed: number;
  totalCost: number;
  costPerDay: number;
  costPerKgWeight: number;
  daysWithLogs: number;
  costSource: string;
  planName: string | null;
  recipeName: string | null;
}

export interface ClientReport {
  id: string;
  title: string;
  generatedAt: string;
  reportType: 'HANDOVER' | 'NUTRITION' | 'HEALTH';
  status: 'DRAFT' | 'FINALIZED' | 'SENT';
  notes?: string;
  recommendations?: string;
  kennelId: string;
  kennel?: Kennel;
  dogId: string;
  dog?: Dog;
  customerId?: string;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

// ================================
// Logistics types
// ================================
export type ShipmentStatus = 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'DELAYED';
export type TransportMode = 'GROUND' | 'AIR' | 'SEA';

export interface Carrier {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  isCertified: boolean;
  certifications: string[];
  rating: number;
  active: boolean;
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  mode: TransportMode;
  scheduledDate: string;
  estimatedArrival?: string;
  actualArrival?: string;
  cost?: number;
  carrierId?: string;
  carrier?: Carrier;
  dogId?: string;
  dog?: Dog;
  customerId?: string;
  customer?: Customer;
  kennelId: string;
  notes?: string;
  externalTrackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransitDocument {
  id: string;
  name: string;
  type: 'PASSPORT' | 'SANITEF' | 'HEALTH_CERT' | 'CITES' | 'OTHER';
  url?: string;
  issuedDate?: string;
  expiryDate?: string;
  isValid: boolean;
  shipmentId: string;
  shipment?: Shipment;
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

// ================================
// Shows types
// ================================
export type ShowStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type ShowDogStatus = 'REGISTERED' | 'CONFIRMED' | 'WITHDRAWN' | 'COMPETED';
export type ShowResultCategory = 'BIS' | 'BOB' | 'BOS' | 'G1' | 'G2' | 'G3' | 'G4' | 'RES' | 'JCAC' | 'CAC' | 'CACIB';

export interface ShowEvent {
  id: string;
  name: string;
  organizer?: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: ShowStatus;
  entryFee?: number;
  federation?: string;
  website?: string;
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShowDog {
  id: string;
  showId: string;
  show?: ShowEvent;
  dogId: string;
  dog?: Dog;
  status: ShowDogStatus;
  className?: string;
  handlerName?: string;
  registrationNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShowResult {
  id: string;
  showId: string;
  show?: ShowEvent;
  dogId: string;
  dog?: Dog;
  category: ShowResultCategory;
  placement?: number;
  points?: number;
  titleEarned?: string;
  judgeName?: string;
  notes?: string;
  createdAt: string;
}

export interface ShowBudgetItem {
  id: string;
  showId: string;
  show?: ShowEvent;
  concept: string;
  estimatedCost: number;
  actualCost?: number;
  category: 'ENTRY' | 'TRAVEL' | 'LODGING' | 'GROOMING' | 'OTHER';
  paid: boolean;
  createdAt: string;
}

// ================================
// Genetics types
// ================================
export interface PedigreeNode {
  id: string;
  dogId: string;
  dog?: Dog;
  father?: PedigreeNode;
  mother?: PedigreeNode;
  generation: number;
}

export interface GeneticTest {
  id: string;
  dogId: string;
  dog?: Dog;
  testName: string;
  labName?: string;
  result: 'CLEAR' | 'CARRIER' | 'AFFECTED' | 'PENDING';
  testDate: string;
  certificateUrl?: string;
  notes?: string;
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BreedingPlan {
  id: string;
  name: string;
  plannedDate?: string;
  fatherId: string;
  father?: Dog;
  motherId: string;
  mother?: Dog;
  predictedCoi?: number;
  goal?: string;
  status: 'PLANNED' | 'APPROVED' | 'EXECUTED' | 'CANCELLED';
  notes?: string;
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

// ================================
// Staff types
// ================================
export type EmployeeRole = 'CARETAKER' | 'VETERINARIAN' | 'RECEPTIONIST' | 'HANDLER' | 'GROOMER' | 'MANAGER';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface Employee {
  id: string;
  userId?: string;
  user?: User;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  hourlyRate?: number;
  hireDate: string;
  kennelId: string;
  locationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: string;
  startTime: string;
  endTime: string;
  type: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  notes?: string;
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employee?: Employee;
  periodStart: string;
  periodEnd: string;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeRate: number;
  bonus?: number;
  deductions?: number;
  totalPay: number;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
  paidAt?: string;
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingCourse {
  id: string;
  name: string;
  provider?: string;
  employeeId: string;
  employee?: Employee;
  completedDate?: string;
  expiryDate?: string;
  certificateUrl?: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

// ================================
// Reviews & Reputation types
// ================================
export type ReviewStatus = 'PENDING' | 'PUBLISHED' | 'REJECTED';

export interface Review {
  id: string;
  customerId?: string;
  customer?: Customer;
  rating: number;
  comment?: string;
  reply?: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  source: 'INTERNAL' | 'TRUSTPILOT' | 'GOOGLE';
  kennelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReputationScore {
  overall: number;
  totalReviews: number;
  avgRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  responseRate: number;
  avgResponseTimeHours?: number;
  verifiedBadge: boolean;
  pedigreeBadge: boolean;
  healthBadge: boolean;
}

export type VerificationStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED';

export interface VerificationRequest {
  id: string;
  kennelId: string;
  status: VerificationStatus;
  steps: VerificationStep[];
  submittedAt?: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationStep {
  id: string;
  name: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  order: number;
  completedAt?: string;
}

// ================================
// Inspections types
// ================================
export type InspectionType = 'HEALTH' | 'FINANCIAL' | 'FACILITY' | 'DOCUMENTARY' | 'PRE_PURCHASE' | 'LITTER' | 'BREEDING' | 'WELFARE' | 'TRANSPORT';
export type InspectionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InspectionResult = 'PASS' | 'CONDITIONAL' | 'FAIL';
export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FindingCategory = 'HEALTH' | 'DOCUMENTATION' | 'FACILITY' | 'FINANCIAL' | 'BEHAVIOR' | 'OTHER';

export interface InspectionChecklistItem {
  id: string;
  inspectionId: string;
  category: string;
  itemText: string;
  order: number;
  isCritical: boolean;
  result?: 'PASS' | 'FAIL' | 'N/A';
  notes?: string;
  score?: number;
  photoUrls?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionDogEvaluation {
  id: string;
  inspectionId: string;
  dogId: string;
  dog?: Dog;
  bodyCondition?: string;
  coatCondition?: string;
  eyeCondition?: string;
  earCondition?: string;
  mobility?: string;
  behavior?: string;
  weight?: number;
  temperature?: number;
  observations?: string;
  needsFollowUp: boolean;
  createdAt: string;
}

export interface InspectionFinding {
  id: string;
  inspectionId: string;
  severity: FindingSeverity;
  category: FindingCategory;
  description: string;
  dogId?: string;
  dog?: Dog;
  correctiveAction?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

export interface Inspection {
  id: string;
  title: string;
  type: InspectionType;
  status: InspectionStatus;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  overallResult?: InspectionResult;
  overallScore?: number;
  overallNotes?: string;
  kennelId: string;
  kennel?: Kennel;
  dogId?: string;
  dog?: Dog;
  litterId?: string;
  litter?: Litter;
  reservationId?: string;
  reservation?: Reservation;
  shipmentId?: string;
  shipment?: Shipment;
  breedingPlanId?: string;
  breedingPlan?: BreedingPlan;
  inspectorId: string;
  inspector?: User;
  creatorId: string;
  creator?: User;
  checklistItems: InspectionChecklistItem[];
  dogEvaluations: InspectionDogEvaluation[];
  findings: InspectionFinding[];
  documents: Document[];
  followUpTaskId?: string;
  followUpTask?: Task;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    checklistItems: number;
    findings: number;
  };
}
