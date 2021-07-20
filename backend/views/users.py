import json

import bcrypt
from flask import request, Response

import app
from views import validateHelper


def register():
    body = request.get_json()

    try:
        user = app.Usuario(
            nome=body['nome'],
            email=body['email'],
            pais=body['pais'],
            estado=body['estado'],
            municipio=body['municipio'],
            cep=body['cep'],
            rua=body['rua'],
            numero=body['numero'],
            complemento=body['complemento'],
            cpf=body['cpf'],
            pis=body['pis'],
            senha=body['senha']
        )

        verify_email = user.email
        verify_pis = user.pis
        verify_cpf = user.cpf

        if validateHelper.email_validate(verify_email) and validateHelper.cpf_validate(verify_cpf) and validateHelper. \
                pis_validate(verify_pis):
            password = user.senha
            password_hash = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
            user.senha = password_hash.decode()
            app.db.session.add(user)
            app.db.session.commit()
            return create_response(201, 'user', user.to_json(), 'User created!')
        return create_response(400, 'user', {}, 'Invalid credentials!')
    except Exception as e:
        return create_response(400, 'user', {}, f'Failed to create! {e}')


def select_id(user_current):
    if not user_current:
        return create_response(400, 'user', {}, 'Token inválido!')

    user_object = app.Usuario.query.get(user_current.id)

    if user_object:
        user_json = user_object.to_json()
        return create_response(200, 'user', user_json, 'User found!')

    return create_response(404, 'user', {}, 'User Not Found!')


def update(user_current):
    if not user_current:
        return create_response(400, 'user', {}, 'Token inválido!')

    user_object = app.Usuario.query.get(user_current.id)

    if not user_object:
        return create_response(404, 'user', {}, 'User Not Found!')

    body = request.get_json()

    try:
        user_object.nome = body['nome']
        user_object.email = body['email']
        user_object.pais = body['pais']
        user_object.estado = body['estado']
        user_object.municipio = body['municipio']
        user_object.cep = body['cep']
        user_object.rua = body['rua']
        user_object.numero = body['numero']
        user_object.complemento = body['complemento']
        user_object.cpf = body['cpf']
        user_object.pis = body['pis']

        verify_email = user_object.email
        verify_pis = user_object.pis
        verify_cpf = user_object.cpf

        if validateHelper.email_validate(verify_email) and validateHelper.cpf_validate(
                verify_cpf) and validateHelper.pis_validate(verify_pis):
            app.db.session.add(user_object)
            app.db.session.commit()
            return create_response(200, 'user', user_object.to_json(), 'User updated!')
        return create_response(400, 'user', {}, 'Invalid credentials!')
    except Exception as e:
        return create_response(400, 'user', {}, 'Failed to update!')


def update_password(user_current):
    if not user_current:
        return create_response(400, 'user', {}, 'Token inválido!')

    user_object = app.Usuario.query.get(user_current.id)

    if not user_object:
        return create_response(400, 'user', {}, 'User Not Found!')
    new_pass = request.authorization
    try:
        password_hash = bcrypt.hashpw(new_pass.password.encode('utf8'), bcrypt.gensalt())
        user_object.senha = password_hash.decode()
        app.db.session.add(user_object)
        app.db.session.commit()
        return create_response(200, 'user', user_object.to_json(), 'User updated!')
    except Exception as e:
        return create_response(400, 'user', {}, 'Failed to update!')


def delete(user_current):
    if not user_current:
        return create_response(400, 'user', {}, 'Token inválido!')

    user_object = app.Usuario.query.get(user_current.id)

    if not user_object:
        return create_response(200, 'user', {}, 'User Not Found!')

    try:
        app.db.session.delete(user_object)
        app.db.session.commit()
        return create_response(200, 'user', user_object.to_json(), 'User Deleted!')
    except Exception as e:
        return create_response(400, 'user', {}, 'Unable to Delete!')


def show_name(user_current):
    if not user_current:
        return create_response(400, 'user', {}, 'Token inválido!')

    body = {
        'username': user_current.nome,
    }
    return create_response(200, 'user', body)


# CREATE MODIFY RESPONSE
def create_response(status, name_content, content, message=False):
    body = {name_content: content}
    if message:
        body['Message'] = message
    return Response(json.dumps(body), status=status, mimetype='application/json')
