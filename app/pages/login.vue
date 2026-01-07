<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <h1 class="brand">DigiBlog</h1>
        <p class="subtitle">Transformez l’actualité en articles de blog prêts à publier</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email address</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="name@company.com" 
            required 
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••" 
            required 
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary full-width" :disabled="loading">
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})
const supabase = useSupabaseClient()
const router = useRouter() // Use router for client-side navigation after login

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (authError) throw authError

    // Successful login
    router.push('/dashboard')
    
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-dark);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.logo {
  text-align: center;
  margin-bottom: 32px;
}

.brand {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.full-width {
  width: 100%;
  margin-top: 8px;
}

.error-message {
  color: var(--color-error);
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
  background-color: rgba(239, 68, 68, 0.1);
  padding: 8px;
  border-radius: var(--radius-sm);
}
</style>
