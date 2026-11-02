<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductosStore } from '../stores/productosStore'

const router = useRouter()
const productosStore = useProductosStore()

const form = ref({
  nombre: '',
  precio: '',
  descripcion: '',
  categoria: '',
  stock: '',
})

const errores = ref({})
const enviado = ref(false)
const exito = ref(false)

const categorias = ['Electrónica', 'Accesorios', 'Audio', 'Ropa', 'Hogar', 'Deportes', 'Otro']

function validar() {
  const e = {}
  if (!form.value.nombre.trim()) e.nombre = 'El nombre es obligatorio.'
  if (!form.value.precio || isNaN(form.value.precio) || Number(form.value.precio) <= 0)
    e.precio = 'Ingresa un precio válido mayor a 0.'
  if (!form.value.descripcion.trim()) e.descripcion = 'La descripción es obligatoria.'
  if (!form.value.categoria) e.categoria = 'Selecciona una categoría.'
  if (form.value.stock === '' || isNaN(form.value.stock) || Number(form.value.stock) < 0)
    e.stock = 'El stock debe ser 0 o mayor.'
  errores.value = e
  return Object.keys(e).length === 0
}

function validarSiEnviado() {
  if (enviado.value) validar()
}

function handleSubmit() {
  enviado.value = true
  if (!validar()) return
  productosStore.agregarProducto({ ...form.value })
  exito.value = true
  setTimeout(() => router.push('/productos'), 1500)
}
</script>

<template>
  <div class="form-view">
    <div class="form-container">
      <!-- Back link -->
      <router-link to="/productos" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Volver a Productos
      </router-link>

      <div class="form-card">
        <!-- Header -->
        <div class="form-card__header">
          <div class="form-card__icon-wrap">➕</div>
          <h1 class="form-card__title">Crear Producto</h1>
          <p class="form-card__subtitle">Completa los datos del nuevo producto</p>
        </div>

        <!-- Éxito -->
        <div v-if="exito" class="alert alert--success" id="alerta-exito-crear">
          <span>✅</span> ¡Producto creado exitosamente! Redirigiendo...
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="form" id="form-crear-producto" novalidate>
          <!-- Nombre -->
          <div class="form-group" :class="{ 'form-group--error': errores.nombre }">
            <label for="input-nombre" class="form-label">Nombre del producto <span class="required">*</span></label>
            <input
              id="input-nombre"
              v-model="form.nombre"
              type="text"
              class="form-control"
              placeholder="Ej: Laptop Pro 15&quot;"
              @input="validarSiEnviado"
            />
            <span v-if="errores.nombre" class="form-error">{{ errores.nombre }}</span>
          </div>

          <!-- Precio y Stock en fila -->
          <div class="form-row">
            <div class="form-group" :class="{ 'form-group--error': errores.precio }">
              <label for="input-precio" class="form-label">Precio (MXN) <span class="required">*</span></label>
              <div class="input-prefix">
                <span class="input-prefix__symbol">$</span>
                <input
                  id="input-precio"
                  v-model="form.precio"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control input-prefix__input"
                  placeholder="0.00"
                  @input="validarSiEnviado"
                />
              </div>
              <span v-if="errores.precio" class="form-error">{{ errores.precio }}</span>
            </div>

            <div class="form-group" :class="{ 'form-group--error': errores.stock }">
              <label for="input-stock" class="form-label">Stock <span class="required">*</span></label>
              <input
                id="input-stock"
                v-model="form.stock"
                type="number"
                min="0"
                class="form-control"
                placeholder="0"
                @input="validarSiEnviado"
              />
              <span v-if="errores.stock" class="form-error">{{ errores.stock }}</span>
            </div>
          </div>

          <!-- Categoría -->
          <div class="form-group" :class="{ 'form-group--error': errores.categoria }">
            <label for="select-categoria-form" class="form-label">Categoría <span class="required">*</span></label>
            <select
              id="select-categoria-form"
              v-model="form.categoria"
              class="form-control"
              @change="validarSiEnviado"
            >
              <option value="">Selecciona una categoría</option>
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <span v-if="errores.categoria" class="form-error">{{ errores.categoria }}</span>
          </div>

          <!-- Descripción -->
          <div class="form-group" :class="{ 'form-group--error': errores.descripcion }">
            <label for="textarea-descripcion" class="form-label">Descripción <span class="required">*</span></label>
            <textarea
              id="textarea-descripcion"
              v-model="form.descripcion"
              class="form-control form-textarea"
              placeholder="Describe el producto..."
              rows="3"
              @input="validarSiEnviado"
            ></textarea>
            <span v-if="errores.descripcion" class="form-error">{{ errores.descripcion }}</span>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <router-link to="/productos" class="btn btn--outline">Cancelar</router-link>
            <button type="submit" class="btn btn--primary" id="btn-submit-crear">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-view { padding: 2rem; }

.form-container {
  max-width: 680px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
}

.back-link:hover { color: var(--primary); }

.form-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 24px;
  overflow: hidden;
}

.form-card__header {
  padding: 2.5rem 2.5rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.form-card__icon-wrap { font-size: 2.5rem; margin-bottom: 0.75rem; }
.form-card__title { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; }
.form-card__subtitle { color: var(--text-muted); font-size: 0.9rem; }

.alert {
  margin: 1.5rem 2.5rem 0;
  padding: 0.9rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert--success {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: #4ade80;
}

.form { padding: 2rem 2.5rem 2.5rem; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.form-group { margin-bottom: 1.25rem; }
.form-group--error .form-control { border-color: #f87171; }

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.required { color: #f87171; }

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.form-textarea { resize: vertical; min-height: 90px; font-family: inherit; }

.input-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix__symbol {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  font-weight: 600;
  pointer-events: none;
}

.input-prefix__input { padding-left: 2rem; }

.form-error { font-size: 0.8rem; color: #f87171; margin-top: 0.35rem; display: block; }

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 600px) {
  .form-view { padding: 1rem; }
  .form { padding: 1.5rem; }
  .form-card__header { padding: 1.5rem; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
