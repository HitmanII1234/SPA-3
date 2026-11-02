<script setup>
import { computed } from 'vue'
import { useCarritoStore } from '../stores/carritoStore'
import { useRouter } from 'vue-router'

const carrito = useCarritoStore()
const router = useRouter()

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
}

const subtotal = computed(() => carrito.totalPrecio)
const envio = computed(() => carrito.items.length > 0 ? 99 : 0)
const total = computed(() => subtotal.value + envio.value)
</script>

<template>
  <div class="carrito-view">
    <div class="carrito-container">
      <!-- Header -->
      <div class="view-header">
        <div>
          <h1 class="view-title">🛒 Carrito de Compras</h1>
          <p class="view-subtitle">
            <span v-if="carrito.items.length">{{ carrito.totalItems }} artículo(s) en tu carrito</span>
            <span v-else>Tu carrito está vacío</span>
          </p>
        </div>
        <button
          v-if="carrito.items.length"
          class="btn btn--outline btn--danger-outline"
          id="btn-vaciar-carrito"
          @click="carrito.vaciarCarrito()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          Vaciar carrito
        </button>
      </div>

      <!-- Layout principal -->
      <div class="carrito-layout">
        <!-- Lista de items -->
        <div class="carrito-items">
          <!-- Vacío -->
          <div v-if="carrito.items.length === 0" class="carrito-empty" id="carrito-vacio">
            <div class="carrito-empty__icon">🛒</div>
            <h2 class="carrito-empty__title">Tu carrito está vacío</h2>
            <p class="carrito-empty__text">Agrega productos desde la lista de productos.</p>
            <button class="btn btn--primary" @click="router.push('/productos')">Ver Productos</button>
          </div>

          <!-- Items -->
          <div
            v-for="item in carrito.items"
            :key="item.id"
            class="carrito-item fade-in-up"
            :id="`carrito-item-${item.id}`"
          >
            <div class="carrito-item__icon">🛍️</div>
            <div class="carrito-item__info">
              <h3 class="carrito-item__nombre">{{ item.nombre }}</h3>
              <p class="carrito-item__desc">{{ item.descripcion }}</p>
              <span class="carrito-item__categoria">{{ item.categoria }}</span>
            </div>
            <div class="carrito-item__controls">
              <!-- Precio unitario -->
              <div class="carrito-item__unit-price">{{ formatPrecio(item.precio) }} c/u</div>
              <!-- Cantidad -->
              <div class="cantidad-control">
                <button
                  class="cantidad-btn"
                  :id="`btn-menos-${item.id}`"
                  @click="carrito.cambiarCantidad(item.id, item.cantidad - 1)"
                >−</button>
                <span class="cantidad-num" :id="`cantidad-${item.id}`">{{ item.cantidad }}</span>
                <button
                  class="cantidad-btn"
                  :id="`btn-mas-${item.id}`"
                  @click="carrito.cambiarCantidad(item.id, item.cantidad + 1)"
                >+</button>
              </div>
              <!-- Subtotal del item -->
              <div class="carrito-item__subtotal">{{ formatPrecio(item.precio * item.cantidad) }}</div>
              <!-- Botón eliminar -->
              <button
                class="btn-remove"
                :id="`btn-eliminar-carrito-${item.id}`"
                title="Eliminar del carrito"
                @click="carrito.eliminarDelCarrito(item.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div v-if="carrito.items.length > 0" class="carrito-resumen" id="resumen-pedido">
          <h2 class="resumen__title">Resumen del Pedido</h2>

          <div class="resumen__lineas">
            <!-- Línea por cada producto -->
            <div
              v-for="item in carrito.items"
              :key="item.id"
              class="resumen__linea resumen__linea--item"
            >
              <span class="resumen__linea-nombre">{{ item.nombre }} × {{ item.cantidad }}</span>
              <span>{{ formatPrecio(item.precio * item.cantidad) }}</span>
            </div>

            <div class="resumen__divider"></div>

            <div class="resumen__linea">
              <span>Subtotal</span>
              <span>{{ formatPrecio(subtotal) }}</span>
            </div>
            <div class="resumen__linea">
              <span>Envío</span>
              <span class="resumen__envio">{{ formatPrecio(envio) }}</span>
            </div>

            <div class="resumen__divider"></div>

            <div class="resumen__linea resumen__linea--total" id="total-carrito">
              <span>Total</span>
              <span>{{ formatPrecio(total) }}</span>
            </div>
          </div>

          <button class="btn btn--primary btn--full" id="btn-finalizar-compra">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            Finalizar Compra
          </button>
          <button class="btn btn--outline btn--full" style="margin-top: 0.75rem" @click="router.push('/productos')">
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carrito-view { padding: 2rem; }
.carrito-container { max-width: 1100px; margin: 0 auto; }

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}
.view-title { font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; }
.view-subtitle { color: var(--text-muted); font-size: 0.9rem; }

/* Layout */
.carrito-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 2rem;
  align-items: start;
}

/* Items */
.carrito-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Vacío */
.carrito-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 24px;
  gap: 0.75rem;
}
.carrito-empty__icon { font-size: 4rem; }
.carrito-empty__title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.carrito-empty__text { color: var(--text-muted); margin-bottom: 0.5rem; }

/* Item de carrito */
.carrito-item {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}
.carrito-item:hover { border-color: rgba(99, 102, 241, 0.3); }

.carrito-item__icon { font-size: 2.5rem; flex-shrink: 0; }

.carrito-item__info { flex: 1; min-width: 0; }
.carrito-item__nombre { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.carrito-item__desc { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.carrito-item__categoria {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.15);
  padding: 0.15rem 0.6rem;
  border-radius: 100px;
}

.carrito-item__controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.carrito-item__unit-price { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; }

/* Control de cantidad */
.cantidad-control {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}
.cantidad-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cantidad-btn:hover { background: rgba(99, 102, 241, 0.15); }
.cantidad-num { min-width: 30px; text-align: center; font-weight: 700; color: var(--text-primary); font-size: 0.95rem; }

.carrito-item__subtotal { font-size: 1rem; font-weight: 700; color: var(--primary); white-space: nowrap; min-width: 90px; text-align: right; }

.btn-remove {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-remove:hover { background: #ef4444; color: white; transform: scale(1.1); }

/* Resumen */
.carrito-resumen {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1.75rem;
  position: sticky;
  top: 100px;
}
.resumen__title { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.25rem; }

.resumen__lineas { display: flex; flex-direction: column; gap: 0.6rem; }
.resumen__linea {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted);
}
.resumen__linea--item .resumen__linea-nombre { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.resumen__linea--total { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem; }
.resumen__envio { color: #4ade80; font-size: 0.85rem; }
.resumen__divider { border-top: 1px solid var(--border); margin: 0.5rem 0; }

.btn--full { width: 100%; }
.btn--danger-outline { border-color: rgba(248, 113, 113, 0.4); color: #f87171; }
.btn--danger-outline:hover { background: rgba(248, 113, 113, 0.1); border-color: #f87171; }

@media (max-width: 900px) {
  .carrito-layout { grid-template-columns: 1fr; }
  .carrito-resumen { position: static; }
}

@media (max-width: 600px) {
  .carrito-view { padding: 1rem; }
  .view-header { flex-direction: column; }
  .carrito-item { flex-wrap: wrap; }
  .carrito-item__controls { flex-wrap: wrap; justify-content: flex-end; width: 100%; }
}
</style>
