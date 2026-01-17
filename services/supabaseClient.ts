
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dazlsoxbywnotgwwkptx.supabase.co';
const supabaseKey = 'sb_publishable_-uLR57cRekEs8TrvaXZ_TA_1empEqaq';

export const supabase = createClient(supabaseUrl, supabaseKey);
