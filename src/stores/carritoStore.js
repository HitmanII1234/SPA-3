import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCarritoStore = defineStore('carrito', () => {
  // State
  const items = ref([])

  // Getters (computed)
  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.cantidad, 0))

  const totalPrecio = computed(() =>
    items.value.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  )

  const estaEnCarrito = computed(() => (id) => {
    return items.value.some(item => item.id === Number(id))
  })

  // Actions
  function agregarAlCarrito(producto) {
    const existente = items.value.find(item => item.id === producto.id)
    if (existente) {
      existente.cantidad++
    } else {
      items.value.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        cantidad: 1,
      })
    }
  }

  function eliminarDelCarrito(id) {
    const idx = items.value.findIndex(item => item.id === Number(id))
    if (idx !== -1) {
      items.value.splice(idx, 1)
    }
  }

  function cambiarCantidad(id, cantidad) {
    const item = items.value.find(item => item.id === Number(id))
    if (item) {
      if (cantidad <= 0) {
        eliminarDelCarrito(id)
      } else {
        item.cantidad = cantidad
      }
    }
  }

  function vaciarCarrito() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrecio,
    estaEnCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    cambiarCantidad,
    vaciarCarrito,
  }
})
