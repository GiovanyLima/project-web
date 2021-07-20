import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {useHistory} from "react-router";
import {isAuthenticated, loginName, logout} from "../../services/auth";
import api from "../../services/api";
import axios from "axios";
import Loader from "../Loader";

const Update = () => {
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
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [validated, setValidated] = useState(false);
    const [valid, setValid] = useState(false)
    const history = useHistory()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (isAuthenticated()) {
            const response = api.get('/user?')
                .then(response => {
                    setNome(response.data.user.nome)
                    setCpf(response.data.user.cpf)
                    setPis(response.data.user.pis)
                    setEmail(response.data.user.email)
                    setCep(response.data.user.cep)
                    setRua(response.data.user.rua)
                    setNum(response.data.user.numero)
                    setComp(response.data.user.complemento)
                    setMunicipio(response.data.user.municipio)
                    setEstado(response.data.user.estado)
                    setPais(response.data.user.pais)
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
                setValid(false)
            })
            .catch(error => {
                setError('Formato de CEP Inválido!')
                setValid(true)
            })
    }

    const handleBack = () => {
        history.push("/home")
    }

    const handleUpdate = async e => {
        e.preventDefault()
        setError('')
        if (!nome || !pis || !email || !cep || !rua || !num || !municipio || !estado || !pais) {
            !cep ? setValid(true) : setValid(false)
            setError('Preencha os dados para continuar!')
            setValidated(true)
        } else {
            try {
                const response = await api.put('/update?', {
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
                    pis: pis
                })
                    .then(response => {
                        alert('Conta atualizada com sucesso!')
                        loginName(nome)
                        history.push("/home")
                    })
            } catch (error) {
                setError('Ocorreu um problema ao registrar, verifique os dados inseridos!')
            }
        }
    }

    const handleDelete = async e => {
        e.preventDefault()
        handleClose()
        try {
            const response = await api.delete('/delete?')
                .then(response => {
                    logout()
                    history.push('/')
                })
        } catch (error) {
            setError('Ocorreu um problema ao deletar!')
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
                <Col lg={4} sm={12} xs={12} md={4} className="p-3">
                    <Container className="container">
                        <h4 className="display-5">Atualizar dados</h4>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
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
                            <Form.Label>CPF</Form.Label>
                            <Form.Control type="text"
                                          required
                                          placeholder="CPF"
                                          maxLength={11}
                                          onChange={(e) => setCpf(e.target.value)}
                                          value={cpf}
                                          isInvalid={validated && !cpf}
                                          disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                Campo Obrigatório*
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>PIS</Form.Label>
                            <Form.Control type="text"
                                          required
                                          placeholder="PIS"
                                          maxLength={11}
                                          onChange={(e) => setPis(e.target.value)}
                                          value={pis}
                                          isInvalid={validated && !pis}
                                          disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                Campo Obrigatório*
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email"
                                          required
                                          placeholder="Email"
                                          onChange={(e) => setEmail(e.target.value)}
                                          value={email}
                                          isInvalid={validated && !email}
                                          disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                Campo Obrigatório*
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CEP</Form.Label>
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
                            <Form.Label>Rua</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Rua"
                                          onChange={(e) => setRua(e.target.value)}
                                          value={rua}
                                          disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Número</Form.Label>
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
                            <Form.Label>Complemento</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Complemento"
                                          onChange={(e) => setComp(e.target.value)}
                                          value={comp}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Município</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Município"
                                          onChange={(e) => setMunicipio(e.target.value)}
                                          value={municipio}
                                          disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Estado"
                                          onChange={(e) => setEstado(e.target.value)}
                                          value={estado}
                                          disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>País</Form.Label>
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
                            <Modal
                                show={show}
                                onHide={handleClose}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header>
                                    <Modal.Title>Exclusão de usuário</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Você deseja mesmo excluir essa conta?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Não
                                    </Button>
                                    <Button variant="primary" onClick={handleDelete}>Sim</Button>
                                </Modal.Footer>
                            </Modal>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button type="submit" variant="primary" onClick={handleUpdate}>Atualizar</Button>
                            <Button variant="danger" onClick={handleShow}>Excluir conta</Button>
                            <Button type="submit" variant="primary" onClick={handleBack}>Voltar</Button>
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Update;