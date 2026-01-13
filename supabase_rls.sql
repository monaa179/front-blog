-- EXÉCUTER CE SCRIPT DANS L'ÉDITEUR SQL SUPABASE

-- 1. Activer RLS sur la table profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Politique : Les utilisateurs peuvent lire leur propre profil
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- 3. Politique : Les administrateurs peuvent TOUT faire
-- On définit une politique unique pour les admins pour simplifier
DROP POLICY IF EXISTS "Admins have full access" ON profiles;
CREATE POLICY "Admins have full access" ON profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);
