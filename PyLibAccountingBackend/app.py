from flask import Flask
from flask_restful import Api, Resource, reqparse, abort
import sqlite3 as sql
import json
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app)
api = Api(app)



def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def jsonify(value):
    return json.dumps(value, ensure_ascii=False)

def getOneFromDB(request):
    with sql.connect("./LibAcc.db") as conn:
        conn.row_factory = dict_factory
        c = conn.cursor()
        c.execute(request)
        res = c.fetchone()
        # conn.close()
        return res

def getAllFromDB(request):
    with sql.connect("./LibAcc.db") as conn:
        conn.row_factory = dict_factory
        c = conn.cursor()
        c.execute(request)
        res = c.fetchall()
        # conn.close()
        return res



# BOOK CONTROLLER
@app.route("/book/", methods=['GET'])
def getBooks():
    res = getAllFromDB("SELECT isbn, name, description, authorId, categoryId FROM books")
    return jsonify(res), 200

@app.route("/book/<string:isbn>", methods=['GET'])
def getBookById(isbn):
    res = getOneFromDB(f"SELECT isbn, name, description, authorId, categoryId FROM books WHERE isbn = '{isbn}'")
    if res is not None:
        return jsonify(res), 200
    abort(404, message="Книга не найдена", status=404)

@app.route("/book/category/<int:id>", methods=['GET'])
def getBookByCategory(id):
    res = getAllFromDB(f"SELECT isbn, name, description, authorId, categoryId FROM books WHERE categoryId = {id}")
    if res is not None:
        return jsonify(res), 200
    abort(404, message="Книги не найдены", status=404)

# @app.route("/book/", methods=['POST'])
# def postBook(isbn):
#     return f"Hello world {isbn}", 200

# @app.route("/book/", methods=['PUT'])
# def putBook(isbn):
#     return f"Hello world {isbn}", 200

# @app.route("/book/", methods=['DELETE'])
# def deleteBook(isbn):
#     return f"Hello world {isbn}", 200

# CATEGORY CONTROLLER
@app.route("/category/", methods=['GET'])
def getCategories():
    res = getAllFromDB("SELECT id, name, parentCategoryId FROM categories")
    return jsonify(res), 200

@app.route("/category/<int:id>", methods=['GET'])
def getCategoryById(id):
    res = getOneFromDB(f"SELECT id, name, parentCategoryId FROM categories WHERE id = {id}")
    if res is not None:
        return jsonify(res), 200
    abort(404, message="Категория не найдена", status=404)

# @app.route("/category/", methods=['POST'])
# def postCategory(isbn):
#     return f"Hello world {isbn}", 200

# @app.route("/category/", methods=['PUT'])
# def putCategory(isbn):
#     return f"Hello world {isbn}", 200

# @app.route("/category/", methods=['DELETE'])
# def deleteCategory(isbn):
#     return f"Hello world {isbn}", 200

# AUTHOR CONTROLLER
@app.route("/author/", methods=['GET'])
def getAuthors():
    res = getAllFromDB("SELECT id, lastName, firstName, patronymic FROM authors")
    return jsonify(res), 200

@app.route("/author/<int:id>", methods=['GET'])
def getAuthorById(id):
    res = getOneFromDB(f"SELECT id, lastName, firstName, patronymic FROM authors WHERE id = {id}")
    if res is not None:
        return jsonify(res), 200
    abort(404, message="Автор не найден")

if __name__ == '__main__':
    app.run(debug=True)

