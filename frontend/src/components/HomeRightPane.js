import React, { Component } from "react";
import { Row, Col } from 'reactstrap';


class HomeRightPane extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const totalUmbrella = parseInt(this.props.totalUmbrella);
    const reservedUmbrella = parseInt(this.props.reservedUmbrella);
    const freeUmbrella = totalUmbrella - reservedUmbrella;

    return (
      <Row>
        <Col lg="12" className='mb-5'>
          <h4>Ombrelloni Totali</h4>
          <h5 className="text-center mt-4">{totalUmbrella}</h5>
        </Col>
        <Col lg="12" className='mb-5'>
          <h4>Ombrelloni Occupati</h4>
          <h5 className="text-center mt-4">{reservedUmbrella}</h5>
        </Col>
        <Col lg="12" className='mb-5'>
          <h4>Ombrelloni Liberi</h4>
          <h5 className="text-center mt-4">{freeUmbrella}</h5>
        </Col>
      </Row>
    );
  }
}

export default HomeRightPane;