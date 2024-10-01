# :rocket:Ecommerce en proceso"

### Este proyecto es un Ecommerce de productos y gestión de carritos de compras. Aún se encuentra en desarrollo. Las tecnologías utilizadas son Node.js con Express, MongoDB, y Mongoose. Permite realizar operaciones CRUD en productos y carritos.


## :pencil:Instalacion del proyecto 

### Para instalar el proyecto se deberá descargar el mismo en https://github.com/YaninaVilte/ecommerce-backend.git En el editor de código se derá abrir la terminal y a continuación escribir:

```
npm install
```
### Esto es para instalar las dependencias utilizadas en este proyecto.


## :open_file_folder:Ejecución del proyecto 

### Para ejecutar de modo local se deberá escribir en la terminal:

```
npm run dev
```
### Una vez realizado los puntos anteriores, el servidor estará corriendo en http://localhost:8080.


## :boom:Endpoints del proyecto

### Ruta de productos:

#### **GET** /api/products: Obtiene una lista de productos con paginación y filtros opcionales de página, límite, orden y búsqueda.
#### **GET** /api/products/:id: Obtiene un producto por su ID.
#### **POST** /api/products: Agrega un nuevo producto.
#### **PUT** /api/products/:id: Actualiza un producto existente por su ID.
#### **DELETE** /api/products/:id: Elimina un producto por su ID.

### Ruta de productos:

#### **POST** /api/carts: Crea un nuevo carrito.
#### **GET** /api/carts/:id: Obtiene un carrito por su ID.
#### **POST** /api/carts/:cartId/product/:productId: Agrega un producto al carrito con la cantidad especificada.
#### **PUT** /api/carts/:cartId/product/:productId: Actualiza la cantidad de un producto en el carrito.
#### **DELETE** /api/carts/:cartId/product/:productId: Elimina un producto determinado del carrito.
#### **DELETE** /api/carts/:id: Vacía el carrito seleccionado.

## :boom:Log de usuarios

### Te dejo una muestra de como funciona:

![Texto alternativo](./src/assets/backendII.gif)


### :woman:Autor
#### Yanina G. Vilte

#### Contacto: yani.vilte@gmail.com