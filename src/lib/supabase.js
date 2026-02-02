import { createClient } from '@supabase/supabase-js'

// REPLACE THESE WITH YOUR ACTUAL SUPABASE KEYS
const supabaseUrl = 'https://ijadcwdubuyjjiypddmn.supabase.co'
const supabaseAnonKey = 'sb_publishable_KL-lDRyhpERJAFsN5sxPhA_AhxZTN4s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)