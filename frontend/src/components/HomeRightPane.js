import React, { Component } from "react";
import { Row, Col, Card, CardTitle, CardText } from 'reactstrap';

class HomeRightPane extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const totalUmbrella = parseInt(this.props.totalUmbrella);
    const reservedUmbrella = parseInt(this.props.reservedUmbrella);
    const freeUmbrella = totalUmbrella - reservedUmbrella;
    const freeSunbeds = this.props.freeSunbeds;

    return (
      <Row className="my-4">
        <Col md="3">
          <Card className='text-center' body>
            <CardTitle tag="h6">Ombrelloni Totali</CardTitle>
            <CardText>{totalUmbrella}</CardText>
          </Card>
        </Col>
        <Col md="3">
          <Card className='text-center' body>
            <CardTitle tag="h6">Ombrelloni Occupati</CardTitle>
            <CardText>{reservedUmbrella}</CardText>
          </Card>
        </Col>
        <Col md="3">
          <Card className='text-center' body>
            <CardTitle tag="h6">Ombrelloni Liberi</CardTitle>
            <CardText>{freeUmbrella}</CardText>
          </Card>
        </Col>
        <Col md="3">
          <Card className='text-center' body>
            <CardTitle tag="h6">Lettini Liberi</CardTitle>
            <CardText>{freeSunbeds}</CardText>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default HomeRightPane;