import sqlite3

conn = sqlite3.connect('./LibAcc.db')

print('DB has been created')

c = conn.cursor()
c.execute("""CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    lastName TEXT NOT NULL,
    firstName TEXT NOT NULL,
    patronymic TEXT
)""")

c.execute("""CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    parentCategoryId INTEGER
)""")

c.execute("""CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    authorId INTEGER NOT NULL,
    categoryId INTEGER NOT NULL,
    FOREIGN KEY(authorId) REFERENCES authors(id),
    FOREIGN KEY(categoryId) REFERENCES categories(id)
)""")

c.execute("""CREATE TABLE userRoles (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL
)""")

c.execute("""CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role INTEGER NOT NULL,
    password TEXT NOT NULL,
    jwtToken UNIQUE,
    refreshToken UNIQUE,
    FOREIGN KEY(role) REFERENCES userRoles(id)
)""")

conn.commit()
conn.close()
print("Tables has been created")
