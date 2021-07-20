import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {isAuthenticated, logout} from "../../services/auth";
import api from "../../services/api";
import Loader from "../Loader";

const Senha = () => {
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        if (isAuthenticated()) {
            const response = api.get('/testAuth?')
                .then(response => {
                    history.push("/your_data_pass")
                })
                .catch(error => {
                    logout()
                    history.push("/")
                })
        } else {
            history.push("/")
        }

        setLoading(false)
    }, [])

    const handleBack = () => {
        history.push("/home")
    }

    const handleConfirm = async e => {
        e.preventDefault()
        if (!password || !passwordConfirm)
            setError('Preencha todos os campos!')
        else if (password !== passwordConfirm)
            setError('Senhas diferentes!')
        else {
            try {
                const response = await api.put('/update_pass', {}, {
                    auth: {
                        username: "",
                        password: password
                    }
                })
                alert('Senha alterada!')
                history.push('/home')
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
                            <h1 className="display-4">Alterar Senha</h1>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    type="password"
                                    placeholder="Senha"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    type="password"
                                    placeholder="Confirmação da Senha"
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    value={passwordConfirm}
                                />
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button type="submit" variant="primary" onClick={handleConfirm}>Confirmar</Button>
                                <Button type="submit" variant="primary" onClick={handleBack}>Voltar</Button>
                            </div>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Senha;