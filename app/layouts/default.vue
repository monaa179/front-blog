<template>
  <div class="layout-container">
    <aside class="sidebar glass-sidebar">
      <div class="logo">
        <div class="logo-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </div>
        <span class="logo-text">DigiBlog</span>
      </div>

      <div class="nav-section">
        <div class="nav-label">General</div>
        <nav class="nav-links">
          <NuxtLink to="/dashboard-stats" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span>Dashboard</span>
          </NuxtLink>
          <NuxtLink to="/dashboard" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><rect x="3" y="5" width="2" height="2"></rect><rect x="3" y="11" width="2" height="2"></rect><rect x="3" y="17" width="2" height="2"></rect></svg>
            <span>Validation</span>
          </NuxtLink>
        </nav>
      </div>

      <div class="nav-section">
        <div class="nav-label">Management</div>
        <nav class="nav-links">
          <NuxtLink to="/library" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Bibliothèque</span>
          </NuxtLink>
          <NuxtLink to="/modules" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            <span>Modules</span>
          </NuxtLink>
          <NuxtLink to="/archive" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path><rect x="3" y="8" width="18" height="4"></rect><path d="M10 12v6"></path><path d="M14 12v6"></path></svg>
            <span>Archive</span>
          </NuxtLink>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="user-card" v-if="user">
          <div class="avatar">{{ user.email?.charAt(0).toUpperCase() }}</div>
          <div class="user-meta">
            <span class="user-email" :title="user.email">{{ user.email }}</span>
            <span class="user-status">Online</span>
          </div>
          <button class="logout-minimal" @click="handleLogout" title="Déconnexion">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const handleLogout = async () => {
  const { error } = await client.auth.signOut()
  if (error) {
    console.error('Logout error:', error)
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-dark);
}

.sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
}

.glass-sidebar {
  background: rgba(8, 8, 8, 0.8);
  backdrop-filter: blur(20px);
}

.logo {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}

.logo-box {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary), #fb7185);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
}

.logo-text {
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-section {
  padding: 12px 14px;
}

.nav-label {
  padding: 0px 12px 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  font-family: 'Inter', sans-serif !important;
  display: block;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all 0.2s var(--ease-out);
}

.nav-item svg {
  opacity: 0.7;
  transition: all 0.2s var(--ease-out);
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
}

.nav-item:hover svg {
  opacity: 1;
  color: var(--primary);
}

.nav-item.router-link-active {
  background-color: var(--primary-subtle);
  color: var(--primary);
  font-weight: 600;
}

.nav-item.router-link-active svg {
  opacity: 1;
  color: var(--primary);
}

.sidebar-footer {
  margin-top: auto;
  padding: 24px 14px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.user-email {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: 10px;
  color: var(--color-success);
  font-weight: 500;
}

.logout-minimal {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-minimal:hover {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  background-color: var(--bg-dark);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 64px;
}

@media (max-width: 1024px) {
  .content-wrapper {
    padding: 32px;
  }
}
</style>
