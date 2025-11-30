export { supabase } from './client';
export type { SupabaseClient } from './client';

export {
  signInWithEmail,
  signUpWithEmail,
  signInWithOtp,
  signOut,
  getSession,
  getUser,
  onAuthStateChange,
  resetPasswordForEmail,
  updateUser,
} from './auth';

export type {
  SignInWithEmailResult,
  SignUpWithEmailResult,
} from './auth';

export {
  uploadFile,
  deleteFile,
  getPublicUrl,
  listFiles,
  createBucket,
} from './storage';

export type {
  UploadOptions,
  UploadResult,
} from './storage';

export {
  checkSupabaseHealth,
  testDatabaseConnection,
  getCurrentUser,
} from './health';

export type {
  HealthCheckResult,
} from './health';
