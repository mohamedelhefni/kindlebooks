from flask import jsonify, request, make_response
from sqlalchemy import desc
from kindlebooks import app, db
from kindlebooks.models import Book


def makePagniation(element):
    pagination = {
        "pages": element.pages,
        "total": element.total,
        "prev": element.prev_num,
        "currentPage": element.page,
        "next": element.next_num,
    }
    return pagination


def custom_error(message, status_code):
    return make_response(jsonify(message), status_code)


@app.errorhandler(404)
def notFound(e):
    return custom_error({"msg": "عذرا لا يوجد نتائج"}, 404)


@app.route("/")
@app.route("/<int:page>")
def index(page=1):
    books = Book.query.order_by(
        desc('views')).paginate(page, 30, error_out=False)
    items = books.items
    pagination = makePagniation(books)
    result = {"books": [book.to_json() for book in items]}
    result['pagination'] = pagination
    response = jsonify(result)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/download", methods=["POST"])
def download():
    drive_id = request.form.get('driveId')
    book = Book.query.filter_by(drive_id=drive_id).first()
    book.downloaded = book.downloaded + 1
    book.views = book.views + 1
    db.session.commit()
    return jsonify({"ID": drive_id, "downloaded": book.downloaded, "msg": "updated succ"})


@app.route("/search/<string:query>", methods=["POST", "GET"])
@app.route("/search/<string:query>/page/<int:page>", methods=["POST", "GET"])
def search(query, page=1):
    if request.method == "POST":
        query = request.form.get('query')
    books = Book.query
    if len(query) > 0:
        books = books.filter(Book.name.like('%' + query + '%'))

    books = books.order_by(desc('views')).paginate(page, 30)
    pagination = makePagniation(books)
    result = {"books": [book.to_json() for book in books.items]}
    result['pagination'] = pagination
    response = jsonify(result)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
