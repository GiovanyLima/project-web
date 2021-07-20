import unittest
import json
from base64 import b64encode

from app import app, Usuario, db


token = '?&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidGVzdEBnbWFpbC5jb20iLCJleHAiOjE2MjY4MDI1NDZ9.C5pTBsQv0zVqmAkv0cDmRPtF-HSyA8JgIYYf10sRE4I'

username = 'test@gmail.com'
password = 'test123'
body = {
    'nome': 'test',
    'email': 'test@gmail.com',
    'pais': 'Brasil',
    'estado': 'SP',
    'municipio': 'São Paulo',
    'cep': '08320500',
    'rua': 'Rua Baltazar Barbosa',
    'numero': '260',
    'complemento': 'Casa',
    'cpf': '69419862046',
    'pis': '95621440481',
    'senha': 'test123'
}
body_json = json.dumps(body)

body_update = {
    'nome': 'testUpdate',
    'email': 'testUpdate@gmail.com',
    'pais': 'Brasil',
    'estado': 'SP',
    'municipio': 'São Paulo',
    'cep': '08320500',
    'rua': 'Rua Baltazar Barbosa',
    'numero': '260',
    'complemento': 'Casa',
    'cpf': '69419862046',
    'pis': '95621440481',
    'senha': 'test123'
}
bodyUpdate_json = json.dumps(body_update)


class MyTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:usbw@localhost/desafio-web'
        self.app = app.test_client()

    @unittest.skip("")
    def test_router_register_and_auth(self):
        test = app.test_client(self)
        response = test.post('/register', data=body_json, content_type='application/json',
                             follow_redirects=True)
        self.assertEqual(response.status_code, 201)

        headers = {
            'Authorization': 'Basic %s' % b64encode(bytes(username + ':' + password, "utf-8")).decode("ascii")
        }
        response = test.post('/auth', headers=headers, content_type='application/json',
                             follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    @unittest.skip("")
    def test_router_user(self):
        test = app.test_client(self)
        response = test.get('/user' + token)
        self.assertEqual(response.status_code, 200)

    @unittest.skip("")
    def test_router_testAuth(self):
        test = app.test_client(self)
        response = test.get('/testAuth' + token)
        self.assertEqual(response.status_code, 200)

    @unittest.skip("")
    def test_router_update(self):
        test = app.test_client(self)
        response = test.put('/update' + token, data=bodyUpdate_json, content_type='application/json',
                            follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    @unittest.skip("")
    def test_router_update_password(self):
        test = app.test_client(self)
        new_password = 'novasenha'
        headers = {
            'Authorization': 'Basic %s' % b64encode(bytes(username + ':' + new_password, "utf-8")).decode("ascii")
        }
        response = test.put('/update_pass' + token, headers=headers, content_type='application/json',
                            follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    @unittest.skip("")
    def test_router_delete(self):
        test = app.test_client(self)
        response = test.delete('/delete' + token, follow_redirects=True)
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
