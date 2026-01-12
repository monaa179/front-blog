-- 1. Enable RLS
alter table article_favorites enable row level security;

-- 2. Clean up existing policies to avoid conflicts
drop policy if exists "read own article favorites" on article_favorites;
drop policy if exists "insert own article favorite" on article_favorites;
drop policy if exists "delete own article favorite" on article_favorites;

-- 3. Create a single "FOR ALL" policy for maximum compatibility with UPSERT
-- This covers SELECT, INSERT, UPDATE, and DELETE in one rule.
create policy "manage_own_favorites"
on article_favorites
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 4. VERIFICATION QUERY
-- SELECT polname, polpermissive, polcmd, polqual, polwithcheck FROM pg_policy WHERE polrelid = 'article_favorites'::regclass;
