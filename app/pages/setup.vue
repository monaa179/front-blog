<template>
  <div class="setup-container">
    <div class="setup-card glass-panel">
      <div class="logo">
        <h1 class="brand">DigiBlog</h1>
        <p class="subtitle">Initialisation de l'administrateur</p>
      </div>

      <div v-if="success" class="success-message">
        <div class="success-icon">✅</div>
        <h2>Compte créé !</h2>
        <p>Votre compte administrateur est prêt. Vous pouvez maintenant vous connecter.</p>
        <NuxtLink to="/login" class="btn btn-primary full-width">Aller à la connexion</NuxtLink>
      </div>

      <form v-else @submit.prevent="handleSetup" class="setup-form">
        <div class="form-grid">
          <div class="form-group">
            <label>Prénom</label>
            <input v-model="form.first_name" placeholder="Jean" required />
          </div>
          <div class="form-group">
            <label>Nom</label>
            <input v-model="form.last_name" placeholder="Dupont" required />
          </div>
        </div>

        <div class="form-group">
          <label>Email address</label>
          <input 
            type="email" 
            v-model="form.email" 
            placeholder="admin@example.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="form.password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary full-width" :disabled="loading">
          <span v-if="loading">Création en cours...</span>
          <span v-else>Créer le compte admin</span>
        </button>
      </form>
      
      <p class="help-text" v-if="!success">
        Cette page n'est accessible que si aucun utilisateur n'existe dans la base de données.
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

const form = ref({
  email: '',
  password: '',
  first_name: '',
  last_name: ''
})

const loading = ref(false)
const error = ref(null)
const success = ref(false)

const handleSetup = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch('/api/auth/setup-admin', {
      method: 'POST',
      body: form.value
    })

    if (response.success) {
      success.value = true
    }
  } catch (e) {
    error.value = e.data?.statusMessage || e.message || "Une erreur est survenue"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.setup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-dark);
}

.setup-card {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
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

.success-message {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.help-text {
  margin-top: 24px;
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
}
</style>
