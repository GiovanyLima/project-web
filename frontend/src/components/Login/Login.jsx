import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {isAuthenticated, login, loginName, logout} from "../../services/auth";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import api from "../../services/api";
import Loader from "../Loader";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        if (isAuthenticated()) {
            const response = api.get('/testAuth?')
                .then(response => {
                    history.push("/home")
                })
                .catch(error => {
                    logout()
                })
        }
        setLoading(false)
    }, [])

    const handleRegister = () => {
        history.push("/register")
    }

    const handleLogin = async e => {
        e.preventDefault()
        setError('')
        if (!username || !password)
            setError('Preencha com Email, CPF ou PIS e a Senha para continuar!')
        else {
            try {
                const response = await api.post('/auth', {}, {
                    auth: {
                        username: username,
                        password: password
                    }
                })
                login(response.data.access_token.token)
                loginName(response.data.access_token.username)
                history.push("/home")

            } catch (error) {
                setError('Ocorreu um problema com o login, verifique suas credenciais!')
            }
        }
    }

    if (loading) {
        return (
            <Loader/>
        )
    }

    return (
        <Container fluid>
            <Row className="justify-content-md-center mb-3">
                <Col lg={4} sm={12} xs={12} md={4} className="text-center p-3">
                    <Container className="container">
                        <Form>
                            <h1 className="display-4">Olá, Visitante</h1>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    type="text"
                                    placeholder="Email, PIS ou CPF"
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    type="password"
                                    placeholder="Senha"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button type="submit" variant="primary" onClick={handleLogin}>Entrar</Button>
                                <Button type="submit" variant="primary" onClick={handleRegister}>Registrar</Button>
                            </div>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;