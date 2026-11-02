<script setup>
import { useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'
import { useCarritoStore } from '../stores/carritoStore'
import { computed } from 'vue'

const router = useRouter()
const productosStore = useProductosStore()
const carritoStore = useCarritoStore()

const totalProductos = computed(() => productosStore.totalProductos)
const totalItems = computed(() => carritoStore.totalItems)
</script>

<template>
  <div class="inicio">
    <!-- Hero sencillo -->
    <section class="hero">
      <h1 class="hero__title">Bienvenido a <span class="hero__highlight">ShopVue</span></h1>
      <p class="hero__sub">Gestiona tu catálogo de productos y carrito de compras fácilmente.</p>
      <div class="hero__stats">
        <div class="stat">
          <span class="stat__num">{{ totalProductos }}</span>
          <span class="stat__label">Productos</span>
        </div>
        <div class="stat__sep"></div>
        <div class="stat">
          <span class="stat__num">{{ totalItems }}</span>
          <span class="stat__label">En carrito</span>
        </div>
      </div>
      <div class="hero__actions">
        <button class="btn btn--primary" @click="router.push('/productos')">Ver Productos</button>
        <button class="btn btn--outline" @click="router.push('/carrito')">Ver Carrito</button>
      </div>
    </section>

    <!-- Accesos rápidos -->
    <section class="accesos">
      <div class="acceso-card" @click="router.push('/productos')">
        <span class="acceso-card__icon">📦</span>
        <h3 class="acceso-card__title">Lista de Productos</h3>
        <p class="acceso-card__desc">Ver, editar y eliminar productos del catálogo.</p>
      </div>
      <div class="acceso-card" @click="router.push('/productos/crear')">
        <span class="acceso-card__icon">➕</span>
        <h3 class="acceso-card__title">Crear Producto</h3>
        <p class="acceso-card__desc">Agrega un nuevo producto al catálogo.</p>
      </div>
      <div class="acceso-card" @click="router.push('/carrito')">
        <span class="acceso-card__icon">🛒</span>
        <h3 class="acceso-card__title">Carrito</h3>
        <p class="acceso-card__desc">Revisa los productos en tu carrito y el total.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.inicio {
  max-width: 860px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

/* Hero */
.hero {
  text-align: center;
  margin-bottom: 3rem;
}
.hero__title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}
.hero__highlight { color: var(--primary); }
.hero__sub {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.hero__stats {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem 2rem;
  margin-bottom: 1.75rem;
}
.stat { text-align: center; }
.stat__num {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}
.stat__label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}
.stat__sep {
  width: 1px;
  height: 36px;
  background: var(--border);
}

.hero__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* Accesos */
.accesos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.acceso-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}
.acceso-card:hover {
  border-color: rgba(99,102,241,0.4);
  background: rgba(99,102,241,0.05);
  transform: translateY(-2px);
}
.acceso-card__icon { font-size: 1.75rem; display: block; margin-bottom: 0.75rem; }
.acceso-card__title { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem; }
.acceso-card__desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }

@media (max-width: 600px) {
  .inicio { padding: 2rem 1rem; }
  .accesos { grid-template-columns: 1fr; }
  .hero__stats { padding: 0.75rem 1.25rem; }
}
</style>
