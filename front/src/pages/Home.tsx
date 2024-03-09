import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { aiModel } from "../App";

const Home = () => {
  return (
    <div>
      <header className='App-header'>
        <Button variant='link'>MGAP</Button>
      </header>
      <br />
      <main>
        <h1>AIモデルを選択してください</h1>
        <Container>
          <Row>
            {aiModel.map((aiModel) => {
              return (
                <Col>
                  <Card style={{ width: "18rem" }}>
                    <Card.Img variant='top' src='holder.js/100px180' />
                    <Card.Body>
                      <Card.Title>{aiModel.modelName}</Card.Title>
                      <Card.Text>{aiModel.description}</Card.Text>
                      <Button variant='primary' href={`/${aiModel.modelName}`}>
                        Play
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </main>
    </div>
  );
};
export default Home;
