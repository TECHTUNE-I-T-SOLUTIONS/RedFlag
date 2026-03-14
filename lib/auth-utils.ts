import bcryptjs from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type User = {
  id: string
  email: string
  created_at: string
  last_signin_at: string | null
  is_active: boolean
}

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, created_at, last_signin_at, is_active')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, created_at, last_signin_at, is_active')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  passwordHash: string
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
        is_active: true,
      }
    ])
    .select('id, email, created_at, last_signin_at, is_active')
    .single()

  if (error || !data) {
    throw new Error('Failed to create user')
  }

  return data
}

/**
 * Verify user credentials (email + password)
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, password_hash, created_at, last_signin_at, is_active')
    .eq('email', email.toLowerCase())
    .eq('is_active', true)
    .single()

  if (error || !user) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password_hash)

  if (!isValidPassword) {
    return null
  }

  // Update last_signin_at
  await supabase
    .from('users')
    .update({ last_signin_at: new Date().toISOString() })
    .eq('id', user.id)

  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    last_signin_at: new Date().toISOString(),
    is_active: user.is_active,
  }
}

/**
 * Check if user already exists
 */
export async function userExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (error) {
    console.error('Error checking user existence:', error)
    return false
  }

  return data !== null
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, avatar_url, bio, created_at, updated_at')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  fullName?: string,
  avatarUrl?: string,
  bio?: string
) {
  const updateData: any = {}
  if (fullName !== undefined) updateData.full_name = fullName
  if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl
  if (bio !== undefined) updateData.bio = bio

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select('id, user_id, full_name, avatar_url, bio, created_at, updated_at')
    .single()

  if (error || !data) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}
