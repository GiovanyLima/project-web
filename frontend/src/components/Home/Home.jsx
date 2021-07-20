import React, {useEffect, useState} from "react";
import {getName, isAuthenticated, logout} from "../../services/auth";
import {useHistory} from "react-router";
import {Button, Col, Container, Row} from "react-bootstrap";
import Loader from "../Loader";
import api from "../../services/api";


const Home = () => {
    const history = useHistory()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated()) {
            const response = api.get('/testAuth?')
                .then(response => {
                    history.push("/home")
                })
                .catch(error => {
                    logout()
                    history.push("/")
                })
        } else {
            history.push("/")
        }
        setLoading(false)
    }, []);

    const handleQuit = () => {
        logout()
        history.push("/")
    }

    const handleUpdate = () => {
        history.push("/your_data")
    }

    const handlePass = () => {
        history.push("/your_data_pass")
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
                        <h1 className="display-5">Olá, {getName()}</h1>
                        <h1 className="display-4">Seja bem-vindo(a)</h1>
                        <p/>
                        <div className="d-grid gap-2">
                            <Button type="submit" variant="primary" onClick={handleUpdate}>Atualizar Dados</Button>
                            <Button type="submit" variant="primary" onClick={handlePass}>Alterar Senha</Button>
                            <Button type="submit" variant="primary" onClick={handleQuit}>Sair</Button>
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;