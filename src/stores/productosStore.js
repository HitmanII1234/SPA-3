import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const productosIniciales = [
  { id: 1, nombre: 'Laptop Pro 15', precio: 24999, descripcion: 'Laptop potente para trabajo, estudio y entretenimiento.', categoria: 'Electrónica', stock: 12, imagen: './images/laptop.svg' },
  { id: 2, nombre: 'Audífonos Inalámbricos', precio: 1899, descripcion: 'Audífonos con cancelación de ruido y batería de larga duración.', categoria: 'Audio', stock: 24, imagen: './images/headphones.svg' },
  { id: 3, nombre: 'Mouse Ergonómico', precio: 899, descripcion: 'Mouse inalámbrico cómodo con precisión ajustable.', categoria: 'Accesorios', stock: 18, imagen: './images/mouse.svg' },
  { id: 4, nombre: 'Mochila Urbana', precio: 1299, descripcion: 'Mochila resistente con compartimento acolchado para laptop.', categoria: 'Ropa', stock: 9, imagen: './images/backpack.svg' },
  { id: 5, nombre: 'Lámpara Escritorio LED', precio: 699, descripcion: 'Lámpara regulable con luz cálida y conexión USB.', categoria: 'Hogar', stock: 15, imagen: './images/lamp.svg' },
]

function cargarProductos() {
  try {
    const guardados = localStorage.getItem('shopvue-productos')
    if (!guardados) return productosIniciales

    const productosGuardados = JSON.parse(guardados)
    return productosGuardados.map(producto => {
      const inicial = productosIniciales.find(item => item.id === producto.id)
      return inicial ? { ...producto, imagen: producto.imagen || inicial.imagen } : producto
    })
  } catch {
    return productosIniciales
  }
}

export const useProductosStore = defineStore('productos', () => {
  const productos = ref(cargarProductos())
  const totalProductos = computed(() => productos.value.length)

  watch(productos, (valor) => {
    localStorage.setItem('shopvue-productos', JSON.stringify(valor))
  }, { deep: true })

  function getProductoById(id) {
    return productos.value.find(producto => producto.id === Number(id))
  }

  function agregarProducto(producto) {
    const siguienteId = productos.value.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1
    productos.value.push({
      ...producto,
      id: siguienteId,
      precio: Number(producto.precio),
      stock: Number(producto.stock),
    })
  }

  function editarProducto(id, cambios) {
    const producto = getProductoById(id)
    if (producto) {
      Object.assign(producto, {
        ...cambios,
        precio: Number(cambios.precio),
        stock: Number(cambios.stock),
      })
    }
  }

  function eliminarProducto(id) {
    productos.value = productos.value.filter(producto => producto.id !== Number(id))
  }

  return { productos, totalProductos, getProductoById, agregarProducto, editarProducto, eliminarProducto }
})
