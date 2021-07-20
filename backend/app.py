from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from views import authHelper, users

app = Flask(__name__)

# CORS
CORS(app)

# DATABASE
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:usbw@localhost/desafio-web'  # modify to your config database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# MODEL
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(70), nullable=False)
    email = db.Column(db.String(70), unique=True, nullable=False)
    pais = db.Column(db.String(30), nullable=False)
    estado = db.Column(db.String(50), nullable=False)
    municipio = db.Column(db.String(50), nullable=False)
    cep = db.Column(db.String(10), nullable=False)
    rua = db.Column(db.String(50), nullable=False)
    numero = db.Column(db.String(10), nullable=False)
    complemento = db.Column(db.String(50))
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    pis = db.Column(db.String(11), unique=True, nullable=False)
    senha = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'pais': self.pais,
            'estado': self.estado,
            'municipio': self.municipio,
            'cep': self.cep,
            'rua': self.rua,
            'numero': self.numero,
            'complemento': self.complemento,
            'cpf': self.cpf,
            'pis': self.pis,
            'senha': self.senha
        }


# CREATE
@app.route('/register', methods=['POST'])
def register_user():
    return users.register()


# SEARCH ID
@app.route('/user', methods=['GET'])
@authHelper.auth_required
def select_user_id(user_current):
    return users.select_id(user_current)


# UPDATE
@app.route('/update', methods=['PUT'])
@authHelper.auth_required
def update_user(user_current):
    return users.update(user_current)


# UPDATE PASSWORD
@app.route('/update_pass', methods=['PUT'])
@authHelper.auth_required
def update_user_password(user_current):
    return users.update_password(user_current)


# DELETE
@app.route('/delete', methods=['DELETE'])
@authHelper.auth_required
def delete_user(user_current):
    return users.delete(user_current)


# CREATE TOKEN
@app.route('/auth', methods=['POST'])
def authenticate():
    return authHelper.auth()


# AUTH TOKEN
@app.route('/testAuth', methods=['GET'])
@authHelper.auth_required
def verify(user_current):
    return users.show_name(user_current)


if __name__ == '__main__':
    db.create_all()
    app.run()
