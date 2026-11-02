<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCarritoStore } from './stores/carritoStore'

const route = useRoute()
const carrito = useCarritoStore()

const totalItems = computed(() => carrito.totalItems)
</script>

<template>
  <div class="app">
    <!-- Navbar -->
    <nav class="navbar" id="navbar">
      <div class="navbar__inner">
        <!-- Brand -->
        <router-link to="/" class="navbar__brand" id="navbar-brand">
          🛍️ <span>ShopVue</span>
        </router-link>

        <!-- Links -->
        <div class="navbar__links">
          <router-link to="/" class="navbar__link" id="nav-inicio" exact-active-class="navbar__link--active">Inicio</router-link>
          <router-link to="/productos" class="navbar__link" id="nav-productos" active-class="navbar__link--active">Productos</router-link>
          <router-link to="/productos/crear" class="navbar__link" id="nav-crear" active-class="navbar__link--active">+ Crear</router-link>
        </div>

        <!-- Carrito -->
        <router-link to="/carrito" class="navbar__carrito" id="nav-carrito" active-class="navbar__carrito--active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          <span v-if="totalItems > 0" class="navbar__badge">{{ totalItems }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Contenido -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="footer">
      Hecho con ❤️ usando Vue 3, Pinia y Vue Router
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 58px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  flex-shrink: 0;
}
.navbar__brand span {
  color: var(--primary);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
}

.navbar__link {
  padding: 0.4rem 0.75rem;
  border-radius: 7px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.15s;
}
.navbar__link:hover {
  color: var(--text-primary);
  background: rgba(255,255,255,0.04);
}
.navbar__link--active {
  color: var(--primary);
  background: rgba(99,102,241,0.1);
}

/* Carrito */
.navbar__carrito {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all 0.15s;
}
.navbar__carrito:hover,
.navbar__carrito--active {
  color: var(--primary);
  border-color: rgba(99,102,241,0.4);
  background: rgba(99,102,241,0.08);
}

.navbar__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--primary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 2px solid var(--bg);
}

/* Main */
.main-content { flex: 1; }

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Footer */
.footer {
  text-align: center;
  padding: 1rem;
  color: var(--text-muted);
  font-size: 0.8rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 480px) {
  .navbar__inner { padding: 0 1rem; gap: 1rem; }
  .navbar__link { padding: 0.4rem 0.5rem; font-size: 0.8rem; }
}
</style>
