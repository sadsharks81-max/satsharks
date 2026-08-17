export interface User {
  id: string;
  _id?: string;
  userId?: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT" | "TEACHER";
  country: string;
  region: "LOCAL" | "INTERNATIONAL";
  subscription: "FREE" | "PAID";
  status: "ACTIVE" | "SUSPENDED";
  hasPendingPayment?: boolean;
  subscriptionExpiry?: string;
  portalAccessStart?: string;
  portalAccessEnd?: string;
  targetScore?: number;
  dailyGoal?: number;
  streakCount?: number;
  leaderboardPoints?: number;
}

export interface SubscriptionPlan {
  _id?: string;
  id?: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  roleRequired: "LOCAL_FREE" | "LOCAL_PAID" | "INTL_FREE" | "INTL_PAID";
  highlight?: boolean;
}

export interface QuestionCategory {
  _id: string;
  name: string;
  section: "READING_WRITING" | "MATH";
  description: string;
}

export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  _id: string;
  text: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  category?: QuestionCategory | string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  section: "READING_WRITING" | "MATH";
  tags: string[];
  source: "MANUAL" | "AI_EXTRACTED" | "SAT";
  status: "UPLOADED" | "REVIEW" | "PUBLISHED" | "UPDATED";
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
}

export interface DiagnosticTest {
  _id: string;
  title: string;
  description: string;
  section: "READING_WRITING" | "MATH" | "FULL";
  questions: Question[] | string[];
  timeLimit: number;
  totalMarks: number;
  isActive: boolean;
  accessLevel: "FREE" | "PAID";
  questionCount?: number;
  attemptCount?: number;
  createdAt: string;
}

export interface AttemptAnswer {
  question: Question | string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number;
}

export interface TestAttempt {
  _id: string;
  student: string;
  test: DiagnosticTest | string;
  answers: AttemptAnswer[];
  score: number;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  timeTaken: number;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
}

export interface PracticeSession {
  _id: string;
  student: string;
  question: Question | string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  createdAt: string;
}

export interface ExtractedQuestion {
  text: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  category: string;
  difficulty: string;
  section: "READING_WRITING" | "MATH";
  confidence: number;
  approved: boolean;
}

export interface PracticeTestUpload {
  _id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadType?: "FULL_TEST" | "PRACTICE_QUESTIONS";
  uploadedBy: { name: string; email: string } | string;
  status: "UPLOADED" | "PROCESSING" | "EXTRACTED" | "REVIEWED" | "PUBLISHED" | "FAILED";
  extractedQuestions: ExtractedQuestion[];
  reviewNotes: string;
  reviewedBy: { name: string; email: string } | string | null;
  errorMessage: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PredictedScore {
  score: number;
  confidence: number;
  basedOn: number;
  range: { low: number; high: number };
}

export interface DashboardStats {
  totalTests: number;
  practiceCount: number;
  practiceCorrect: number;
  practiceIncorrect: number;
  practiceAccuracy: number;
  avgScore: number;
  bestScore: number;
}

export interface PerformanceDataPoint {
  index: number;
  testTitle: string;
  section: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  date: string;
}

export interface CategoryBreakdown {
  category: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface AdminOverview {
  totalUsers: number;
  paidUsers: number;
  totalQuestions: number;
  publishedQuestions: number;
  totalTests: number;
  activeTests: number;
  totalAttempts: number;
  pendingUploads: number;
  pendingInquiries: number;
  totalStories: number;
}

// --- SAT Test Types ---

export interface SATModuleSummary {
  name: string;
  section: "READING_WRITING" | "MATH";
  questionCount: number;
  timeLimitMinutes: number;
}

export interface SATModule {
  name: string;
  section: "READING_WRITING" | "MATH";
  moduleNumber: number;
  questions: Question[];
  timeLimitMinutes: number;
}

export interface SATTest {
  _id: string;
  title: string;
  description: string;
  year: number;
  testNumber: number;
  isAdaptive?: boolean;
  modules: SATModule[];
  breakDurationMinutes: number;
  isActive: boolean;
  accessLevel: "FREE" | "PAID";
  pdfUrl: string;
  explanationPdfUrl?: string;
  rwScoreMapping?: number[];
  mathScoreMapping?: number[];
  totalQuestions?: number;
  totalMinutes?: number;
  attemptCount?: number;
  modulesSummary?: SATModuleSummary[];
  createdAt: string;
}

export interface SATModuleAttemptAnswer {
  question: Question | string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  markedForReview: boolean;
  timeSpent: number;
}

export interface SATModuleAttempt {
  moduleIndex: number;
  answers: SATModuleAttemptAnswer[];
  startedAt: string | null;
  completedAt: string | null;
  score: number;
  totalQuestions: number;
  correctCount: number;
}

export interface SATTestAttempt {
  _id: string;
  student: string;
  test: SATTest | string;
  moduleAttempts: SATModuleAttempt[];
  currentModuleIndex: number;
  breakStartedAt: string | null;
  breakCompletedAt: string | null;
  totalScore: number;
  totalQuestions: number;
  totalCorrect: number;
  percentage: number;
  totalTimeTaken: number;
  status: "IN_PROGRESS" | "ON_BREAK" | "COMPLETED" | "ABANDONED" | "TIMED_OUT";
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
}

export interface ConsultingRequest {
  _id: string;
  student: User | string;
  level: "UNDERGRADUATE" | "GRADUATE";
  secondaryType: "MATRIC" | "O_LEVEL" | "";
  secondaryObtained: number | null;
  secondaryTotal: number | null;
  secondaryGrades: string;
  higherType: "FSC" | "A_LEVEL" | "";
  higherObtained: number | null;
  higherTotal: number | null;
  higherGrades: string;
  gpa: string;
  satScore: number | null;
  gradeYear: string;
  targetUniversities: string[];
  selectedScholarship: string;
  extracurriculars: string;
  budgetRange: string;
  status: "PENDING" | "IN_REVIEW" | "COMPLETED";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Essay {
  _id: string;
  student: User | string;
  type: "COMMON_APP" | "SUPPLEMENTAL" | "OTHER";
  targetUniversity: string;
  essayText: string;
  fileUrl: string;
  status: "PENDING" | "IN_REVIEW" | "REVIEWED";
  adminFeedback: string;
  reviewedBy: User | string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  user: User | string;
  type: "ESSAY_SUBMITTED" | "ESSAY_REVIEWED" | "CONSULTING_SUBMITTED" | "PAYMENT_SUCCESS" | "ACCOUNT" | "TEST" | "CONTACT_INQUIRY" | "ADMIN_REPLY";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
