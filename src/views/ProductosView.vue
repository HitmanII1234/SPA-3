<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'
import { useCarritoStore } from '../stores/carritoStore'

const router = useRouter()
const productosStore = useProductosStore()
const carritoStore = useCarritoStore()

const busqueda = ref('')
const categoriaFiltro = ref('')
const confirmEliminar = ref(null)

const categorias = computed(() => {
  const set = new Set(productosStore.productos.map(p => p.categoria).filter(Boolean))
  return [...set].sort()
})

const productosFiltrados = computed(() => {
  let lista = productosStore.productos
  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    )
  }
  if (categoriaFiltro.value) {
    lista = lista.filter(p => p.categoria === categoriaFiltro.value)
  }
  return lista
})

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
}

function handleEliminar(id) {
  confirmEliminar.value = id
}

function confirmarEliminar() {
  productosStore.eliminarProducto(confirmEliminar.value)
  confirmEliminar.value = null
}

function agregarAlCarrito(producto) {
  carritoStore.agregarAlCarrito(producto)
}

// Imagen de fallback si no hay imagen definida
function imagenSrc(producto) {
  const imagenesPorId = {
    1: '/SPA-3/images/laptop.svg',
    2: '/SPA-3/images/headphones.svg',
    3: '/SPA-3/images/mouse.svg',
    4: '/SPA-3/images/backpack.svg',
    5: '/SPA-3/images/lamp.svg',
  }
  return imagenesPorId[producto.id] || producto.imagen || `https://placehold.co/400x260/1e1e2e/6366f1?text=${encodeURIComponent(producto.nombre)}`
}
</script>

<template>
  <div class="productos-view">
    <!-- Header -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">{{ productosFiltrados.length }} productos encontrados</p>
      </div>
      <router-link to="/productos/crear" class="btn btn--primary" id="btn-crear-producto">
        + Nuevo Producto
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="filtros">
      <div class="filtros__search-wrap">
        <svg class="filtros__search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          id="input-busqueda"
          v-model="busqueda"
          type="text"
          placeholder="Buscar producto..."
          class="filtros__input"
        />
      </div>
      <select id="select-categoria" v-model="categoriaFiltro" class="filtros__select">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Grid -->
    <div v-if="productosFiltrados.length > 0" class="productos-grid">
      <div
        v-for="producto in productosFiltrados"
        :key="producto.id"
        class="pcard"
        :id="`producto-${producto.id}`"
      >
        <!-- Imagen -->
        <div class="pcard__img-wrap">
          <img
            :src="imagenSrc(producto)"
            :alt="producto.nombre"
            class="pcard__img"
            loading="lazy"
          />
          <span class="pcard__categoria-badge">{{ producto.categoria }}</span>
          <span
            class="pcard__stock-badge"
            :class="{ 'pcard__stock-badge--low': producto.stock < 5 }"
          >
            Stock: {{ producto.stock }}
          </span>
        </div>

        <!-- Info -->
        <div class="pcard__body">
          <h3 class="pcard__nombre">{{ producto.nombre }}</h3>
          <p class="pcard__desc">{{ producto.descripcion }}</p>
        </div>

        <!-- Footer -->
        <div class="pcard__footer">
          <span class="pcard__precio">{{ formatPrecio(producto.precio) }}</span>
          <div class="pcard__acciones">
            <button
              class="pcard__btn pcard__btn--cart"
              :class="{ 'pcard__btn--added': carritoStore.estaEnCarrito(producto.id) }"
              :title="carritoStore.estaEnCarrito(producto.id) ? 'En el carrito' : 'Agregar al carrito'"
              :id="`btn-carrito-${producto.id}`"
              @click="agregarAlCarrito(producto)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </button>
            <router-link
              :to="`/productos/${producto.id}`"
              class="pcard__btn pcard__btn--edit"
              title="Editar"
              :id="`btn-editar-${producto.id}`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </router-link>
            <button
              class="pcard__btn pcard__btn--del"
              title="Eliminar"
              :id="`btn-eliminar-${producto.id}`"
              @click="handleEliminar(producto.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vacío -->
    <div v-else class="empty">
      <p class="empty__icon">📦</p>
      <p class="empty__text">No se encontraron productos.</p>
      <router-link to="/productos/crear" class="btn btn--primary">Crear Producto</router-link>
    </div>

    <!-- Modal confirmar eliminación -->
    <Teleport to="body">
      <div v-if="confirmEliminar !== null" class="modal-overlay" @click.self="confirmEliminar = null">
        <div class="modal" id="modal-confirmar-eliminar">
          <p class="modal__icon">🗑️</p>
          <h3 class="modal__title">¿Eliminar este producto?</h3>
          <p class="modal__text">Esta acción no se puede deshacer.</p>
          <div class="modal__btns">
            <button class="btn btn--outline" id="btn-cancelar-eliminar" @click="confirmEliminar = null">Cancelar</button>
            <button class="btn btn--danger" id="btn-confirmar-eliminar" @click="confirmarEliminar">Eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.productos-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}
.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
}
.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

/* Filtros */
.filtros {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}
.filtros__search-wrap {
  position: relative;
  flex: 1;
  min-width: 180px;
}
.filtros__search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}
.filtros__input {
  width: 100%;
  padding: 0.6rem 0.9rem 0.6rem 2.4rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.filtros__input:focus {
  outline: none;
  border-color: var(--primary);
}
.filtros__select {
  padding: 0.6rem 0.9rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filtros__select:focus {
  outline: none;
  border-color: var(--primary);
}

/* Grid */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

/* Product card */
.pcard {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}
.pcard:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

/* Image */
.pcard__img-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #12121f;
}
.pcard__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.pcard:hover .pcard__img {
  transform: scale(1.04);
}

/* Badges sobre imagen */
.pcard__categoria-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  color: #e2e8f0;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}
.pcard__stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.4);
  color: #4ade80;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}
.pcard__stock-badge--low {
  background: rgba(248, 113, 113, 0.2);
  border-color: rgba(248, 113, 113, 0.4);
  color: #f87171;
}

/* Body */
.pcard__body {
  padding: 0.9rem 1rem 0.5rem;
  flex: 1;
}
.pcard__nombre {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
}
.pcard__desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.pcard__footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pcard__precio {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary);
}
.pcard__acciones {
  display: flex;
  gap: 0.35rem;
}
.pcard__btn {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s;
  text-decoration: none;
}
.pcard__btn--cart {
  background: rgba(99,102,241,0.12);
  color: #818cf8;
}
.pcard__btn--cart:hover { background: var(--primary); color: #fff; }
.pcard__btn--cart.pcard__btn--added { background: rgba(74,222,128,0.12); color: #4ade80; }

.pcard__btn--edit {
  background: rgba(251,191,36,0.12);
  color: #fbbf24;
}
.pcard__btn--edit:hover { background: #fbbf24; color: #1a1a2e; }

.pcard__btn--del {
  background: rgba(248,113,113,0.12);
  color: #f87171;
}
.pcard__btn--del:hover { background: #ef4444; color: #fff; }

/* Empty */
.empty {
  text-align: center;
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.empty__icon { font-size: 3rem; }
.empty__text { color: var(--text-muted); }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  max-width: 340px;
  width: 90%;
  text-align: center;
}
.modal__icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.modal__title { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem; }
.modal__text { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.25rem; }
.modal__btns { display: flex; gap: 0.75rem; justify-content: center; }

@media (max-width: 600px) {
  .productos-view { padding: 1rem; }
  .page-header { flex-direction: column; align-items: flex-start; }
}
</style>
