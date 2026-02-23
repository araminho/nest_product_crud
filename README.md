# NestJS CRUD API (Products & Categories)

Simple CRUD application built with NestJS, PostgreSQL, JWT authentication, and Postman collection for testing.

---

## Features

* JWT authentication (register & login)
* PostgreSQL database via TypeORM
* CRUD for:

  * Categories
  * Products (each product belongs to one category)
* Validation with class-validator
* Environment-based configuration (.env)
* Ready-to-use Postman collection

---

## 1. Clone the Repository

```bash
git clone https://github.com/araminho/nest_product_crud.git
cd nest_product_crud
```

Install dependencies:

```bash
npm install
```

---

## 2. Setup Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=nestjs_crud

JWT_SECRET=super_secret_key
```

Make sure PostgreSQL is running and the database exists:

```sql
CREATE DATABASE nestjs_crud;
```

---

## 3. Run the Application

```bash
npm run start:dev
```

If everything is correct, server will start at:

```
http://localhost:3000
```

---

## 4. Test API with Postman

### Import Collection

1. Open Postman
2. Click **Import**
3. Select file:

```
postman/nestjs_crud_api.postman_collection.json
```

4. Create environment variable:

```
access_token
```

---

### Testing Flow

#### 1. Register user

```
POST /auth/register
```


#### 2. Login

```
POST /auth/login
```

The response will contain `access_token` which will be automatically copied to Postman environment variable `access_token` via test script in Postman collection. 
This token is required for all subsequent requests to protected endpoints.
Only the GET endpoints are public and do not require authentication.

---

#### 3. Test Categories

* Create category
* Get all categories
* Get category by id
* Update category
* Delete category

---

#### 4. Test Products

* Create product
* Get all products
* Get product by id
* Update product
* Delete product

Note: Create category first before creating a product.

---

## 5. Notes

* `.env` file is ignored by git (do not commit credentials)
* `synchronize=true` is enabled for development only
* Delete category is blocked if it has products
* Delete endpoints return success message

---

## 6. Future Improvements

* File upload for product images
* Role-based access control (admin/user)
* Refresh tokens
* Pagination & filtering
* Unit tests for services
* Docker setup

---

## Author Notes

Project created while learning NestJS and TypeORM.
