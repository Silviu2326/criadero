import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post('/auth/register', data),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string; avatarUrl?: string; address?: string; city?: string }) =>
    api.put('/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

// Users API (Manager only)
export const usersApi = {
  getAll: (params?: { role?: string; status?: string; search?: string }) =>
    api.get('/users', { params }),

  getById: (id: string) => api.get(`/users/${id}`),

  create: (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    kennelIds?: string[];
    vetData?: { license?: string; specialization?: string };
  }) => api.post('/users', data),

  update: (id: string, data: any) => api.put(`/users/${id}`, data),

  toggleStatus: (id: string) => api.patch(`/users/${id}/toggle-status`),

  delete: (id: string) => api.delete(`/users/${id}`),

  getVeterinarians: () => api.get('/users/veterinarians'),
};

// Kennels API
export const kennelsApi = {
  getAll: (params?: { search?: string; status?: string }) =>
    api.get('/kennels', { params }),

  getMyKennels: () => api.get('/kennels/my-kennels'),

  getById: (id: string) => api.get(`/kennels/${id}`),

  getStats: (id: string) => api.get(`/kennels/${id}/stats`),

  create: (data: {
    name: string;
    description?: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
    website?: string;
    breederId: string;
    logoUrl?: string;
  }) => api.post('/kennels', data),

  update: (id: string, data: any) => api.put(`/kennels/${id}`, data),

  toggleStatus: (id: string) => api.patch(`/kennels/${id}/toggle-status`),
};

// Breeds API
export const breedsApi = {
  getAll: (params?: { search?: string; group?: string }) =>
    api.get('/breeds', { params }),

  getById: (id: string) => api.get(`/breeds/${id}`),

  create: (data: { name: string; group?: string; description?: string; origin?: string }) =>
    api.post('/breeds', data),

  update: (id: string, data: any) => api.put(`/breeds/${id}`, data),

  toggleStatus: (id: string) => api.patch(`/breeds/${id}/toggle-status`),

  getGroups: () => api.get('/breeds/groups'),
};

// Dogs API
export const dogsApi = {
  getAll: (params?: {
    kennelId?: string;
    search?: string;
    status?: string;
    gender?: string;
    breedId?: string;
    visibility?: string;
    birthDateFrom?: string;
    birthDateTo?: string;
    fatherId?: string;
    motherId?: string;
    customerId?: string;
  }) => api.get('/dogs', { params }),

  getParents: (params: { kennelId: string; gender: string }) =>
    api.get('/dogs/parents', { params }),

  getById: (id: string) => api.get(`/dogs/${id}`),

  create: (data: {
    name: string;
    breedId: string;
    gender: Gender;
    birthDate: string;
    color?: string;
    microchip?: string;
    pedigree?: string;
    price?: number;
    status?: DogStatus;
    visibility?: DogVisibility;
    internalNotes?: string;
    kennelId: string;
    fatherId?: string;
    motherId?: string;
    photos?: string[];
  }) => api.post('/dogs', data),

  update: (id: string, data: any) => api.put(`/dogs/${id}`, data),

  toggleVisibility: (id: string) => api.patch(`/dogs/${id}/toggle-visibility`),

  delete: (id: string) => api.delete(`/dogs/${id}`),

  addPhotos: (id: string, urls: string[]) =>
    api.post(`/dogs/${id}/photos`, { urls }),

  removePhoto: (id: string, photoId: string) =>
    api.delete(`/dogs/${id}/photos/${photoId}`),

  setMainPhoto: (id: string, photoId: string) =>
    api.patch(`/dogs/${id}/photos/${photoId}/main`),

  getPedigree: (dogId: string) => api.get(`/dogs/${dogId}/pedigree`),
};

// Litters API
export const littersApi = {
  getAll: (params?: { kennelId?: string }) =>
    api.get('/litters', { params }),

  getById: (id: string) => api.get(`/litters/${id}`),

  create: (data: {
    birthDate: string;
    fatherId: string;
    motherId: string;
    puppyCount?: number;
    deadPuppies?: number;
    notes?: string;
    kennelId: string;
    puppies?: { name?: string; gender?: Gender; color?: string }[];
  }) => api.post('/litters', data),

  update: (id: string, data: any) => api.put(`/litters/${id}`, data),

  delete: (id: string) => api.delete(`/litters/${id}`),

  addPuppy: (id: string, data: { name?: string; gender?: Gender; color?: string; microchip?: string }) =>
    api.post(`/litters/${id}/puppies`, data),

  updatePuppy: (id: string, puppyId: string, data: any) =>
    api.put(`/litters/${id}/puppies/${puppyId}`, data),

  deletePuppy: (id: string, puppyId: string) =>
    api.delete(`/litters/${id}/puppies/${puppyId}`),

  promotePuppy: (id: string, puppyId: string, data: { name?: string; breedId?: string }) =>
    api.post(`/litters/${id}/puppies/${puppyId}/promote`, data),
};

// Customers API
export const customersApi = {
  getAll: (params?: { kennelId?: string; search?: string; isArchived?: boolean }) =>
    api.get('/customers', { params }),

  getById: (id: string) => api.get(`/customers/${id}`),

  create: (data: {
    kennelId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    notes?: string;
  }) => api.post('/customers', data),

  update: (id: string, data: any) => api.put(`/customers/${id}`, data),

  archive: (id: string) => api.patch(`/customers/${id}/archive`),

  link: (id: string, userId: string) => api.post(`/customers/${id}/link`, { userId }),

  delete: (id: string) => api.delete(`/customers/${id}`),
};

// Veterinarian API
export const veterinarianApi = {
  getProfile: () => api.get('/veterinarians/profile'),

  updateProfile: (data: { license?: string; specialization?: string }) =>
    api.put('/veterinarians/profile', data),

  getMyKennels: () => api.get('/veterinarians/kennels'),

  getKennelDogs: (kennelId: string) =>
    api.get(`/veterinarians/kennels/${kennelId}/dogs`),

  getUpcomingVaccines: () => api.get('/veterinarians/upcoming-vaccines'),
};

// Medical Records API
export const medicalApi = {
  getByDog: (dogId: string) => api.get(`/medical/dog/${dogId}`),

  getById: (id: string) => api.get(`/medical/${id}`),

  create: (data: {
    dogId: string;
    type: MedicalRecordType;
    date: string;
    description: string;
    nextDate?: string;
    attachmentUrl?: string;
    vaccineName?: string;
    vaccineLot?: string;
    vaccineLab?: string;
    dewormerProduct?: string;
    weightAtDate?: number;
    diagnosis?: string;
    treatment?: string;
    postOpNotes?: string;
  }) => api.post('/medical', data),

  update: (id: string, data: any) => api.put(`/medical/${id}`, data),

  delete: (id: string) => api.delete(`/medical/${id}`),

  getAlerts: (params?: { kennelId?: string }) =>
    api.get('/medical/alerts', { params }),

  uploadAttachment: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/medical/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Reservations API
export const reservationsApi = {
  getAll: (params?: {
    kennelId?: string;
    status?: string;
    customerId?: string;
    dogId?: string;
  }) => api.get('/reservations', { params }),

  getById: (id: string) => api.get(`/reservations/${id}`),

  create: (data: {
    dogId: string;
    kennelId: string;
    customerId: string;
    amount?: number;
    deposit?: number;
    notes?: string;
    requestMessage?: string;
  }) => api.post('/reservations', data),

  update: (id: string, data: { status?: string; amount?: number; deposit?: number; notes?: string }) =>
    api.put(`/reservations/${id}`, data),

  cancel: (id: string) => api.patch(`/reservations/${id}/cancel`),

  delete: (id: string) => api.delete(`/reservations/${id}`),
};

// Reports API
export const reportsApi = {
  getKennelReport: (kennelId: string, params?: { startDate?: string; endDate?: string }) =>
    api.get('/reports/kennel', { params: { kennelId, ...params } }),

  getManagerReport: (params?: { kennelId?: string; startDate?: string; endDate?: string }) =>
    api.get('/reports/manager', { params }),

  getSalesReport: (params?: { kennelId?: string; startDate?: string; endDate?: string }) =>
    api.get('/reports/sales', { params }),

  getBreedReport: (params?: { kennelId?: string }) =>
    api.get('/reports/breeds', { params }),
};

// Public API (no auth required)
export const publicApi = {
  getKennels: (params?: { search?: string }) =>
    api.get('/public/kennels', { params }),

  getKennel: (slug: string) => api.get(`/public/kennels/${slug}`),

  getDog: (slug: string, dogId: string) =>
    api.get(`/public/kennels/${slug}/dogs/${dogId}`),
};

// Finance API
export const financeApi = {
  // Summary
  getFinancialSummary: (kennelId: string, params?: { period?: string; startDate?: string; endDate?: string }) =>
    api.get(`/finance/summary/${kennelId}`, { params }),

  // Transactions
  getTransactions: (kennelId: string, params?: { type?: string; categoryId?: string; startDate?: string; endDate?: string; limit?: number; offset?: number }) =>
    api.get(`/finance/transactions/${kennelId}`, { params }),

  getTransactionById: (id: string) =>
    api.get(`/finance/transactions/detail/${id}`),

  createTransaction: (kennelId: string, data: {
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    date: string;
    description: string;
    notes?: string;
    categoryId: string;
    paymentMethod?: string;
    reference?: string;
    dogId?: string;
    customerId?: string;
    reservationId?: string;
  }) => api.post(`/finance/transactions/${kennelId}`, data),

  updateTransaction: (id: string, data: any) =>
    api.put(`/finance/transactions/${id}`, data),

  deleteTransaction: (id: string) =>
    api.delete(`/finance/transactions/${id}`),

  // Categories
  getCategories: (kennelId: string, params?: { type?: string }) =>
    api.get(`/finance/categories/${kennelId}`, { params }),

  createCategory: (kennelId: string, data: { name: string; type: string; color?: string; icon?: string; description?: string }) =>
    api.post(`/finance/categories/${kennelId}`, data),

  updateCategory: (id: string, data: any) =>
    api.put(`/finance/categories/${id}`, data),

  deleteCategory: (id: string) =>
    api.delete(`/finance/categories/${id}`),

  // Invoices
  getInvoices: (kennelId: string, params?: { status?: string; customerId?: string; startDate?: string; endDate?: string; limit?: number; offset?: number }) =>
    api.get(`/finance/invoices/${kennelId}`, { params }),

  getInvoiceById: (id: string) =>
    api.get(`/finance/invoices/detail/${id}`),

  createInvoice: (kennelId: string, data: {
    customerId: string;
    issueDate?: string;
    dueDate?: string;
    items: { description: string; quantity: number; unitPrice: number; dogId?: string }[];
    notes?: string;
    taxRate?: number;
  }) => api.post(`/finance/invoices/${kennelId}`, data),

  updateInvoice: (id: string, data: any) =>
    api.put(`/finance/invoices/${id}`, data),

  deleteInvoice: (id: string) =>
    api.delete(`/finance/invoices/${id}`),

  recordPayment: (id: string, data: { amount: number; date?: string; paymentMethod?: string; notes?: string; categoryId?: string }) =>
    api.post(`/finance/invoices/${id}/payment`, data),

  getOverdueInvoices: (kennelId: string) =>
    api.get(`/finance/invoices/overdue/${kennelId}`),

  getInvoiceStats: (kennelId: string, params?: { year?: number }) =>
    api.get(`/finance/invoices/stats/${kennelId}`, { params }),

  // Inventory
  getInventoryItems: (kennelId: string, params?: { category?: string; lowStock?: boolean; search?: string; limit?: number; offset?: number }) =>
    api.get(`/finance/inventory/${kennelId}`, { params }),

  getInventoryItemById: (id: string) =>
    api.get(`/finance/inventory/detail/${id}`),

  createInventoryItem: (kennelId: string, data: {
    name: string;
    category: string;
    description?: string;
    quantity: number;
    unit: string;
    minStock?: number;
    cost?: number;
    supplier?: string;
  }) => api.post(`/finance/inventory/${kennelId}`, data),

  updateInventoryItem: (id: string, data: any) =>
    api.put(`/finance/inventory/${id}`, data),

  deleteInventoryItem: (id: string) =>
    api.delete(`/finance/inventory/${id}`),

  recordInventoryMovement: (id: string, data: { type: 'IN' | 'OUT'; quantity: number; reason: string; notes?: string }) =>
    api.post(`/finance/inventory/${id}/movement`, data),

  adjustInventory: (id: string, data: { newQuantity: number; reason: string; notes?: string }) =>
    api.post(`/finance/inventory/${id}/adjust`, data),

  getInventoryStats: (kennelId: string) =>
    api.get(`/finance/inventory/stats/${kennelId}`),

  getLowStockAlerts: (kennelId: string) =>
    api.get(`/finance/inventory/alerts/${kennelId}`),
};

// Messages API
export const messagesApi = {
  getConversations: () =>
    api.get('/messages/conversations'),

  getMessages: (userId: string) =>
    api.get(`/messages/${userId}`),

  sendMessage: (data: { receiverId: string; content: string; dogId?: string }) =>
    api.post('/messages', data),

  getUnreadCount: () =>
    api.get('/messages/unread-count'),

  markAsRead: (senderId: string) =>
    api.post('/messages/mark-read', { senderId }),
};

// Calendar API
export const calendarApi = {
  getAll: (params?: {
    kennelId?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    dogId?: string;
    status?: string;
  }) => api.get('/calendar', { params }),

  getById: (id: string) => api.get(`/calendar/${id}`),

  create: (data: {
    title: string;
    type: string;
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
  }) => api.post('/calendar', data),

  update: (id: string, data: any) => api.put(`/calendar/${id}`, data),

  delete: (id: string) => api.delete(`/calendar/${id}`),

  toggleStatus: (id: string) => api.patch(`/calendar/${id}/toggle-status`),

  getUpcoming: (params?: { kennelId?: string; days?: number }) =>
    api.get('/calendar/upcoming', { params }),

  getByRange: (params: { kennelId?: string; startDate: string; endDate: string }) =>
    api.get('/calendar/range', { params }),

  createFromMedical: (data: { medicalRecordId: string; kennelId: string }) =>
    api.post('/calendar/from-medical', data),
};

// Documents API
export const documentsApi = {
  // Documents
  getAll: (params?: {
    kennelId?: string;
    type?: string;
    dogId?: string;
    customerId?: string;
    search?: string;
    status?: string;
  }) => api.get('/documents', { params }),

  getById: (id: string) => api.get(`/documents/${id}`),

  upload: (data: FormData) =>
    api.post('/documents/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: {
    name?: string;
    description?: string;
    tags?: string;
    status?: string;
    isPublic?: boolean;
  }) => api.put(`/documents/${id}`, data),

  delete: (id: string) => api.delete(`/documents/${id}`),

  download: (id: string) =>
    api.get(`/documents/${id}/download`, { responseType: 'blob' }),

  // Contract generation
  generateContract: (data: {
    kennelId: string;
    customerId?: string;
    dogId?: string;
    contractType?: string;
    price?: number;
    deposit?: number;
    terms?: string;
    templateId?: string;
  }) => api.post('/documents/generate-contract', data),

  // Pedigree generation
  generatePedigree: (data: {
    dogId: string;
    kennelId: string;
  }) => api.post('/documents/generate-pedigree', data),

  // Templates
  getTemplates: (params?: { kennelId?: string; type?: string }) =>
    api.get('/documents/templates', { params }),

  createTemplate: (data: {
    name: string;
    type: string;
    content: string;
    variables?: string;
    kennelId: string;
  }) => api.post('/documents/templates', data),

  updateTemplate: (id: string, data: any) =>
    api.put(`/documents/templates/${id}`, data),

  deleteTemplate: (id: string) => api.delete(`/documents/templates/${id}`),
};

// Tasks API
export const tasksApi = {
  getAll: (params?: {
    kennelId?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    search?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
  }) => api.get('/tasks', { params }),

  getById: (id: string) => api.get(`/tasks/${id}`),

  create: (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    tags?: string;
    recurrenceRule?: string;
    kennelId: string;
    assignedTo?: string;
    dogId?: string;
    customerId?: string;
    litterId?: string;
  }) => api.post('/tasks', data),

  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),

  updateStatus: (id: string, status: TaskStatus) =>
    api.patch(`/tasks/${id}/status`, { status }),

  delete: (id: string) => api.delete(`/tasks/${id}`),

  getStats: (kennelId: string) => api.get(`/tasks/stats/${kennelId}`),

  getTemplates: (params?: { kennelId?: string }) =>
    api.get('/tasks/templates', { params }),

  createFromTemplate: (data: { templateId: string; kennelId: string }) =>
    api.post('/tasks/from-template', data),
};

// Client Reports API
export const clientReportApi = {
  getAll: (params?: { kennelId?: string; dogId?: string; customerId?: string; status?: string }) =>
    api.get('/reports/client', { params }),
  getById: (id: string) => api.get(`/reports/client/${id}`),
  generate: (data: {
    dogId: string;
    kennelId: string;
    customerId?: string;
    title?: string;
    notes?: string;
    recommendations?: string;
  }) => api.post('/reports/client', data),
  update: (id: string, data: any) => api.put(`/reports/client/${id}`, data),
  finalize: (id: string) => api.patch(`/reports/client/${id}/finalize`),
  delete: (id: string) => api.delete(`/reports/client/${id}`),
};

export default api;

// Nutrition API
export const nutritionApi = {
  // Plans
  getPlans: (params?: { kennelId?: string; search?: string; dietType?: string; isActive?: boolean }) =>
    api.get('/nutrition/plans', { params }),
  getPlanById: (id: string) => api.get(`/nutrition/plans/${id}`),
  createPlan: (data: {
    name: string;
    dietType: DietType;
    targetBreedId?: string;
    minAgeMonths?: number;
    maxAgeMonths?: number;
    minWeightKg?: number;
    maxWeightKg?: number;
    activityLevel: ActivityLevel;
    dailyGramsPerKg: number;
    instructions?: string;
    kennelId: string;
  }) => api.post('/nutrition/plans', data),
  updatePlan: (id: string, data: any) => api.put(`/nutrition/plans/${id}`, data),
  deletePlan: (id: string) => api.delete(`/nutrition/plans/${id}`),

  // Calculator
  calculateRation: (data: { weightKg: number; ageMonths: number; activityLevel: ActivityLevel; neutered?: boolean }) =>
    api.post('/nutrition/calculate-ration', data),

  // Dog diets
  getDogNutritions: (params?: { kennelId?: string; dogId?: string; active?: boolean }) =>
    api.get('/nutrition/dog-nutritions', { params }),
  createDogNutrition: (data: {
    dogId: string;
    planId: string;
    startDate?: string;
    endDate?: string;
    currentWeightKg: number;
    notes?: string;
  }) => api.post('/nutrition/dog-nutritions', data),
  updateDogNutrition: (id: string, data: any) => api.put(`/nutrition/dog-nutritions/${id}`, data),
  deleteDogNutrition: (id: string) => api.delete(`/nutrition/dog-nutritions/${id}`),
  getNutritionStage: (id: string) => api.get(`/nutrition/dog-nutritions/${id}/stage`),

  // Logs
  getLogs: (params?: { kennelId?: string; dogId?: string; planId?: string; dateFrom?: string; dateTo?: string }) =>
    api.get('/nutrition/logs', { params }),
  createLog: (data: {
    dogId: string;
    planId: string;
    date?: string;
    gramsServed: number;
    gramsLeftovers?: number;
    notes?: string;
  }) => api.post('/nutrition/logs', data),
  updateLog: (id: string, data: any) => api.put(`/nutrition/logs/${id}`, data),
  deleteLog: (id: string) => api.delete(`/nutrition/logs/${id}`),

  // Supplements
  getSupplements: (params?: { kennelId?: string; dogId?: string; active?: boolean }) =>
    api.get('/nutrition/supplements', { params }),
  createSupplement: (data: {
    dogId: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
  }) => api.post('/nutrition/supplements', data),
  updateSupplement: (id: string, data: any) => api.put(`/nutrition/supplements/${id}`, data),
  deleteSupplement: (id: string) => api.delete(`/nutrition/supplements/${id}`),

  // Recipes
  getRecipes: (params?: { kennelId?: string; search?: string; dietType?: string; isActive?: boolean }) =>
    api.get('/nutrition/recipes', { params }),
  getRecipeById: (id: string) => api.get(`/nutrition/recipes/${id}`),
  createRecipe: (data: {
    name: string;
    dietType: DietType;
    portions?: number;
    instructions?: string;
    notes?: string;
    kennelId: string;
    ingredients: { name: string; quantity: number; unit: string; costPerUnit?: number; notes?: string; inventoryItemId?: string }[];
  }) => api.post('/nutrition/recipes', data),
  updateRecipe: (id: string, data: any) => api.put(`/nutrition/recipes/${id}`, data),
  deleteRecipe: (id: string) => api.delete(`/nutrition/recipes/${id}`),
  calculateRecipeCost: (id: string) => api.get(`/nutrition/recipes/${id}/cost`),

  // Intolerances
  getIntolerances: (params?: { kennelId?: string; dogId?: string; search?: string; severity?: string; isActive?: boolean }) =>
    api.get('/nutrition/intolerances', { params }),
  getIntoleranceById: (id: string) => api.get(`/nutrition/intolerances/${id}`),
  createIntolerance: (data: { dogId: string; foodName: string; severity: string; symptoms?: string; notes?: string }) =>
    api.post('/nutrition/intolerances', data),
  updateIntolerance: (id: string, data: any) => api.put(`/nutrition/intolerances/${id}`, data),
  deleteIntolerance: (id: string) => api.delete(`/nutrition/intolerances/${id}`),
  getIntoleranceReactions: (id: string) => api.get(`/nutrition/intolerances/${id}/reactions`),
  createIntoleranceReaction: (id: string, data: { date?: string; symptoms: string; severity: string; notes?: string }) =>
    api.post(`/nutrition/intolerances/${id}/reactions`, data),
  updateIntoleranceReaction: (reactionId: string, data: any) => api.put(`/nutrition/intolerances/reactions/${reactionId}`, data),
  deleteIntoleranceReaction: (reactionId: string) => api.delete(`/nutrition/intolerances/reactions/${reactionId}`),
  checkIntoleranceAlert: (data: { dogId: string; foodName: string }) => api.post('/nutrition/intolerances/check', data),

  // Feeding Costs
  getFeedingCosts: (params?: { kennelId?: string; dateFrom?: string; dateTo?: string; dogId?: string }) =>
    api.get('/nutrition/feeding-costs', { params }),
  getFeedingCostSummary: (params?: { kennelId?: string; dateFrom?: string; dateTo?: string }) =>
    api.get('/nutrition/feeding-costs/summary', { params }),
};

// ================================
// Logistics API
// ================================
export const logisticsApi = {
  getShipments: (params?: { kennelId?: string; status?: string }) =>
    api.get('/logistics/shipments', { params }),

  getShipmentByTracking: (trackingNumber: string) =>
    api.get(`/logistics/shipments/tracking/${trackingNumber}`),

  createShipment: (data: Partial<import('@/types').Shipment>) =>
    api.post('/logistics/shipments', data),

  updateShipment: (id: string, data: Partial<import('@/types').Shipment>) =>
    api.put(`/logistics/shipments/${id}`, data),

  deleteShipment: (id: string) =>
    api.delete(`/logistics/shipments/${id}`),

  getCarriers: (params?: { kennelId?: string; search?: string }) =>
    api.get('/logistics/carriers', { params }),

  createCarrier: (data: Partial<import('@/types').Carrier>) =>
    api.post('/logistics/carriers', data),

  updateCarrier: (id: string, data: Partial<import('@/types').Carrier>) =>
    api.put(`/logistics/carriers/${id}`, data),

  deleteCarrier: (id: string) =>
    api.delete(`/logistics/carriers/${id}`),

  getTransitDocuments: (params?: { kennelId?: string; shipmentId?: string }) =>
    api.get('/logistics/documents', { params }),

  createTransitDocument: (data: Partial<import('@/types').TransitDocument>) =>
    api.post('/logistics/documents', data),

  updateTransitDocument: (id: string, data: Partial<import('@/types').TransitDocument>) =>
    api.put(`/logistics/documents/${id}`, data),

  deleteTransitDocument: (id: string) =>
    api.delete(`/logistics/documents/${id}`),
};

// ================================
// Shows API
// ================================
export const showsApi = {
  getShows: (params?: { kennelId?: string; status?: string }) =>
    api.get('/shows', { params }),

  create: (data: Omit<import('@/types').ShowEvent, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post('/shows', data),

  updateShow: (id: string, data: Partial<import('@/types').ShowEvent>) =>
    api.put(`/shows/${id}`, data),

  deleteShow: (id: string) =>
    api.delete(`/shows/${id}`),

  getShowDogs: (showIdOrParams: string | { kennelId?: string; status?: string }, params?: { kennelId?: string; status?: string }) => {
    if (typeof showIdOrParams === 'string') {
      return api.get(`/shows/${showIdOrParams}/dogs`, { params });
    }
    return api.get('/shows/dogs', { params: showIdOrParams });
  },

  createShowDog: (showId: string, data: Partial<import('@/types').ShowDog>) =>
    api.post(`/shows/${showId}/dogs`, data),

  updateShowDog: (showId: string, showDogId: string, data: Partial<import('@/types').ShowDog>) =>
    api.put(`/shows/${showId}/dogs/${showDogId}`, data),

  deleteShowDog: (showId: string, showDogId: string) =>
    api.delete(`/shows/${showId}/dogs/${showDogId}`),

  getShowResults: (showIdOrParams: string | { kennelId?: string; category?: string }, params?: { kennelId?: string; category?: string }) => {
    if (typeof showIdOrParams === 'string') {
      return api.get(`/shows/${showIdOrParams}/results`, { params });
    }
    return api.get('/shows/results', { params: showIdOrParams });
  },

  createShowResult: (showId: string, data: Partial<import('@/types').ShowResult>) =>
    api.post(`/shows/${showId}/results`, data),

  updateShowResult: (showId: string, resultId: string, data: Partial<import('@/types').ShowResult>) =>
    api.put(`/shows/${showId}/results/${resultId}`, data),

  deleteShowResult: (showId: string, resultId: string) =>
    api.delete(`/shows/${showId}/results/${resultId}`),

  getShowBudget: (showIdOrParams: string | { kennelId?: string; category?: string }, params?: { kennelId?: string; category?: string }) => {
    if (typeof showIdOrParams === 'string') {
      return api.get(`/shows/${showIdOrParams}/budget`, { params });
    }
    return api.get('/shows/budget', { params: showIdOrParams });
  },

  createShowBudgetItem: (showId: string, data: Partial<import('@/types').ShowBudgetItem>) =>
    api.post(`/shows/${showId}/budget`, data),

  updateShowBudgetItem: (showId: string, itemId: string, data: Partial<import('@/types').ShowBudgetItem>) =>
    api.put(`/shows/${showId}/budget/${itemId}`, data),

  deleteShowBudgetItem: (showId: string, itemId: string) =>
    api.delete(`/shows/${showId}/budget/${itemId}`),
};

// ================================
// Genetics API
// ================================
export const geneticsApi = {
  calculateCoi: (fatherId: string, motherId: string) =>
    api.post('/genetics/calculate-coi', { fatherId, motherId }),

  getGeneticTests: (params?: { kennelId?: string; dogId?: string }) =>
    api.get('/genetics/tests', { params }),

  getBreedingPlans: (params?: { kennelId?: string }) =>
    api.get('/genetics/breeding-plans', { params }),
};

// ================================
// Staff API
// ================================
export const staffApi = {
  getEmployees: (params?: { kennelId?: string; role?: string; status?: string }) =>
    api.get('/staff/employees', { params }),

  createEmployee: (data: Partial<import('@/types').Employee>) =>
    api.post('/staff/employees', data),

  updateEmployee: (id: string, data: Partial<import('@/types').Employee>) =>
    api.put(`/staff/employees/${id}`, data),

  deleteEmployee: (id: string) =>
    api.delete(`/staff/employees/${id}`),

  getShifts: (params?: { kennelId?: string; employeeId?: string; dateFrom?: string; dateTo?: string }) =>
    api.get('/staff/shifts', { params }),

  createShift: (data: Partial<import('@/types').Shift>) =>
    api.post('/staff/shifts', data),

  updateShift: (id: string, data: Partial<import('@/types').Shift>) =>
    api.put(`/staff/shifts/${id}`, data),

  deleteShift: (id: string) =>
    api.delete(`/staff/shifts/${id}`),

  getPayroll: (params?: { kennelId?: string; employeeId?: string; status?: string }) =>
    api.get('/staff/payroll', { params }),

  createPayroll: (data: Partial<import('@/types').PayrollEntry>) =>
    api.post('/staff/payroll', data),

  updatePayroll: (id: string, data: Partial<import('@/types').PayrollEntry>) =>
    api.put(`/staff/payroll/${id}`, data),

  deletePayroll: (id: string) =>
    api.delete(`/staff/payroll/${id}`),

  getTrainingCourses: (params?: { kennelId?: string; employeeId?: string }) =>
    api.get('/staff/training', { params }),

  createTrainingCourse: (data: Partial<import('@/types').TrainingCourse>) =>
    api.post('/staff/training', data),

  updateTrainingCourse: (id: string, data: Partial<import('@/types').TrainingCourse>) =>
    api.put(`/staff/training/${id}`, data),

  deleteTrainingCourse: (id: string) =>
    api.delete(`/staff/training/${id}`),
};

// ================================
// Reviews & Reputation API (mock)
// ================================
export const reviewsApi = {
  getReviews: (params?: { kennelId?: string; status?: string; source?: string }) =>
    api.get('/reviews', { params }),

  getReputation: (kennelId: string) =>
    api.get(`/reviews/reputation/${kennelId}`),

  getVerification: (kennelId: string) =>
    api.get(`/reviews/verification/${kennelId}`),
};

// ================================
// Inspections API
// ================================
export const inspectionsApi = {
  getAll: (params?: {
    kennelId?: string;
    type?: string;
    status?: string;
    inspectorId?: string;
    dogId?: string;
    litterId?: string;
    dateFrom?: string;
    dateTo?: string;
    result?: string;
  }) => api.get('/inspections', { params }),

  getById: (id: string) => api.get(`/inspections/${id}`),

  create: (data: {
    title?: string;
    type: string;
    scheduledDate: string;
    kennelId: string;
    dogId?: string;
    litterId?: string;
    reservationId?: string;
    shipmentId?: string;
    breedingPlanId?: string;
    inspectorId?: string;
  }) => api.post('/inspections', data),

  update: (id: string, data: { title?: string; scheduledDate?: string; inspectorId?: string }) =>
    api.put(`/inspections/${id}`, data),

  delete: (id: string) => api.delete(`/inspections/${id}`),

  start: (id: string) => api.post(`/inspections/${id}/start`),
  complete: (id: string, data: { overallResult: string; overallScore?: number; overallNotes?: string; followUpDate?: string }) =>
    api.post(`/inspections/${id}/complete`, data),
  cancel: (id: string) => api.post(`/inspections/${id}/cancel`),

  updateChecklistItem: (id: string, itemId: string, data: { result?: string; notes?: string; score?: number; photoUrls?: string }) =>
    api.put(`/inspections/${id}/checklist/${itemId}`, data),

  batchUpdateChecklist: (id: string, items: { id: string; result?: string; notes?: string; score?: number }[]) =>
    api.put(`/inspections/${id}/checklist/batch`, { items }),

  createEvaluation: (id: string, data: any) => api.post(`/inspections/${id}/evaluations`, data),
  updateEvaluation: (id: string, evaluationId: string, data: any) => api.put(`/inspections/${id}/evaluations/${evaluationId}`, data),
  deleteEvaluation: (id: string, evaluationId: string) => api.delete(`/inspections/${id}/evaluations/${evaluationId}`),

  createFinding: (id: string, data: { severity: string; category: string; description: string; dogId?: string; correctiveAction?: string }) =>
    api.post(`/inspections/${id}/findings`, data),
  updateFinding: (id: string, findingId: string, data: any) => api.put(`/inspections/${id}/findings/${findingId}`, data),
  deleteFinding: (id: string, findingId: string) => api.delete(`/inspections/${id}/findings/${findingId}`),

  getContext: (id: string) => api.get(`/inspections/${id}/context`),
};

// Import types for the API functions
import type { DogStatus, DogVisibility, Gender, MedicalRecordType, TaskStatus, TaskPriority, DietType, ActivityLevel } from '@/types';
