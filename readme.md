## 1. Install all the dependencies

```bash
    yarn
```

## 2. Create a .env file in the root of the project and add the following variables

```bash
    DATABASE_URL="<YOUR_DATABASE_URL>"
```
If you're running the backend locally, then write the following:

1. Install PostgreSQL
2. Create ROLE and ALTER your role to SUPERUSER and CREATEDB
3. Create a database
4. Add the database URL in the .env file

```bash
    DATABASE_URL="postgres://<ROLE>:<PASSWORD>@localhost:5432/<DATABASE_NAME>"
```

## Run the project

```bash
    yarn dev
```