import { createRouter, createWebHashHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import ProductosView from '../views/ProductosView.vue'
import CrearProductoView from '../views/CrearProductoView.vue'
import EditarProductoView from '../views/EditarProductoView.vue'
import CarritoView from '../views/CarritoView.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: InicioView,
  },
  {
    path: '/productos',
    name: 'productos',
    component: ProductosView,
  },
  {
    path: '/productos/crear',
    name: 'crear-producto',
    component: CrearProductoView,
  },
  {
    path: '/productos/:id',
    name: 'editar-producto',
    component: EditarProductoView,
  },
  {
    path: '/carrito',
    name: 'carrito',
    component: CarritoView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
