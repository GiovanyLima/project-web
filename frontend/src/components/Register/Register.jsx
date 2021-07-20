import React, {useEffect, useState} from "react";
import axios from "axios";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import {useHistory} from "react-router";
import Loader from "../Loader";
import api from "../../services/api";
import {isAuthenticated, logout} from "../../services/auth";


const Register = () => {
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [pis, setPis] = useState('')
    const [email, setEmail] = useState('')
    const [cep, setCep] = useState('')
    const [rua, setRua] = useState('')
    const [num, setNum] = useState('')
    const [comp, setComp] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [estado, setEstado] = useState('')
    const [pais, setPais] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [disable, setDisable] = useState(false)
    const [validated, setValidated] = useState(false);
    const [valid, setValid] = useState(false)
    const history = useHistory()

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
    }, []);

    const handleBlur = () => {
        if (cep !== '')
            consultaCep();
        setError('')
    }

    function limparCep() {
        setRua('')
        setComp('')
        setMunicipio('')
        setEstado('')
        setError('')
        setDisable(false)
        setValid(false)
    }

    function consultaCep() {
        limparCep()
        const response = axios.get('https://viacep.com.br/ws/' + cep + '/json/')
            .then(response => {
                if (response.data.hasOwnProperty('erro')) {
                    setError('CEP Não Encontrado!')
                    setValid(true)
                    return
                }
                setRua(response.data.logradouro)
                setComp(response.data.complemento)
                setMunicipio(response.data.localidade)
                setEstado(response.data.uf)
                setDisable(true)
                setValid(false)
            })
            .catch(error => {
                setError('Formato de CEP Inválido!')
                setValid(true)
            })
    }

    const handleBack = () => {
        history.push("/")
    }

    const handleRegister = async e => {
        e.preventDefault();
        setError('')
        if (!nome || !pis || !email || !cep || !rua || !num || !municipio || !estado || !pais || !senha) {
            !cep ? setValid(true) : setValid(false)
            setError('Preencha os dados para continuar!')
            setValidated(true)
        } else {
            try {
                const response = await api.post('/register', {
                    nome: nome,
                    email: email,
                    pais: pais,
                    estado: estado,
                    municipio: municipio,
                    cep: cep,
                    rua: rua,
                    numero: num,
                    complemento: comp,
                    cpf: cpf,
                    pis: pis,
                    senha: senha
                })
                    .then(response => {
                        alert('Conta criada com sucesso!')
                        history.push("/")
                    })
            } catch (error) {
                setError('Ocorreu um problema ao registrar, verifique os dados inseridos!')
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
                            <h1 className="display-4">Cadastrar</h1>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              required
                                              placeholder="Nome"
                                              onChange={(e) => setNome(e.target.value)}
                                              value={nome}
                                              isInvalid={validated && !nome}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Campo Obrigatório*
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              required
                                              placeholder="CPF"
                                              maxLength={11}
                                              onChange={(e) => setCpf(e.target.value)}
                                              value={cpf}
                                              isInvalid={validated && !cpf}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Campo Obrigatório*
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              required
                                              placeholder="PIS"
                                              maxLength={11}
                                              onChange={(e) => setPis(e.target.value)}
                                              value={pis}
                                              isInvalid={validated && !pis}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Campo Obrigatório*
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="email"
                                              required
                                              placeholder="Email"
                                              onChange={(e) => setEmail(e.target.value)}
                                              value={email}
                                              isInvalid={validated && !email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Campo Obrigatório*
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              required
                                              placeholder="CEP"
                                              maxLength={8}
                                              onBlur={handleBlur}
                                              onChange={(e) => setCep(e.target.value)}
                                              value={cep}
                                              isInvalid={valid}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Campo Obrigatório*
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              placeholder="Rua"
                                              onChange={(e) => setRua(e.target.value)}
                                              value={rua}
                                              disabled={disable}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              placeholder="Número"
                                              onChange={(e) => setNum(e.target.value)}
                                              value={num}
                                              isInvalid={validated && !num}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Campo Obrigatório*
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              placeholder="Complemento"
                                              onChange={(e) => setComp(e.target.value)}
                                              value={comp}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              placeholder="Município"
                                              onChange={(e) => setMunicipio(e.target.value)}
                                              value={municipio}
                                              disabled={disable}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              placeholder="Estado"
                                              onChange={(e) => setEstado(e.target.value)}
                                              value={estado}
                                              disabled={disable}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text"
                                              required
                                              placeholder="País"
                                              onChange={(e) => setPais(e.target.value)}
                                              value={pais}
                                              isInvalid={validated && !pais}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Campo Obrigatório*
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="password"
                                              required
                                              placeholder="Senha"
                                              onChange={(e) => setSenha(e.target.value)}
                                              value={senha}
                                              isInvalid={validated && !senha}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Campo Obrigatório*
                                </Form.Control.Feedback>
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button type='submit' variant="primary" onClick={handleRegister}>Cadastrar-se</Button>
                                <Button type='submit' variant="primary" onClick={handleBack}>Voltar</Button>
                            </div>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;