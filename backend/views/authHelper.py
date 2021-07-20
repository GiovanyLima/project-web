import datetime
from functools import wraps

import bcrypt
import jwt as jwt
from flask import request

import app
from views import validateHelper
from views.users import create_response

KEY_SECRET = "chave mestra"


def auth():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return create_response(401, 'auth', {'authenticate': 'Login Required'}, 'Could Not Verify!')

    if validateHelper.email_validate(auth.username):
        user = search_user_by_email(auth.username)
        if not user:
            return create_response(404, 'user', {}, 'User Not Found!')
        user_entry = user.email
    elif validateHelper.cpf_validate(auth.username):
        user = search_user_by_cpf(auth.username)
        if not user:
            return create_response(404, 'user', {}, 'User Not Found!')
        user_entry = user.cpf
    elif validateHelper.pis_validate(auth.username):
        user = search_user_by_pis(auth.username)
        if not user:
            return create_response(404, 'user', {}, 'User Not Found!')
        user_entry = user.pis
    else:
        return create_response(404, 'user', {}, 'User Not Found!')

    password = auth.password.encode('utf-8')
    stored_hash = user.senha.encode('utf-8')

    if user_entry == auth.username and bcrypt.hashpw(password, stored_hash) == stored_hash:
        payload = {
            'user': user_entry,
            'exp': datetime.datetime.now() + datetime.timedelta(hours=12)
        }
        token = jwt.encode(payload, KEY_SECRET, algorithm="HS256")
        body = {
            'username': user.nome,
            'token': token
        }
        return create_response(200, 'access_token', body, 'Token Created Successfully!')

    return create_response(401, 'auth', {'authenticate': 'Login Required'}, 'Could Not Verify!')


def auth_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.args.get('token')

        if not token:
            return create_response(401, 'access_token', {}, 'Token missing!')

        try:
            token_decoded = jwt.decode(token, KEY_SECRET, algorithms=["HS256"])

            if validateHelper.email_validate(token_decoded['user']):
                user_current = search_user_by_email(token_decoded['user'])
            elif validateHelper.cpf_validate(token_decoded['user']):
                user_current = search_user_by_cpf(token_decoded['user'])
            elif validateHelper.pis_validate(token_decoded['user']):
                user_current = search_user_by_pis(token_decoded['user'])
            else:
                user_current = None

        except:
            return create_response(401, 'access_token', token, 'Token Invalid Or Expired!')

        return f(user_current=user_current, *args, **kwargs)

    return decorator


# SELECT USER BY CPF (UNIQUE)
def search_user_by_cpf(cpf):
    try:
        return app.Usuario.query.filter(app.Usuario.cpf == cpf).one()
    except Exception as e:
        return None


# SELECT USER BY PIS (UNIQUE)
def search_user_by_pis(pis):
    try:
        return app.Usuario.query.filter(app.Usuario.pis == pis).one()
    except Exception as e:
        return None


# SELECT USER BY EMAIL (UNIQUE)
def search_user_by_email(email):
    try:
        return app.Usuario.query.filter(app.Usuario.email == email).one()
    except Exception as e:
        return None
