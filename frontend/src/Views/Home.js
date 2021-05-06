import React, { Component } from "react";
import styled from 'styled-components';
import HomeRightPane from "../components/HomeRightPane";
import HomeCentralPane from "../components/HomeCentralPane";
import { Table, Button, Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import faker from 'faker';

var i = 0;

const createUmbrella = () => {
  i++;
  return {
    id: i,
    paid: faker.datatype.boolean() ? null : faker.datatype.boolean(),
  }
}

const createUmbrellas = (numUmbrella = 5) => {
  return new Array(numUmbrella)
    .fill(undefined)
    .map(createUmbrella);
}

const umbrella = createUmbrellas(80)


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      umbrellaList: umbrella,
      splitRow: 10,
      filterDate: new Date(),
      modal: false,
      activeItem: {
        id: 0,
        position: "",
        beach_loungers: "",
        paid: null
      },
    };
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleDelete = (item) => {
    alert("delete" + JSON.stringify(item));
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  render() {
    let i = 0;
    this.state.umbrellaList.forEach((item) => 
      item.paid != null ? i++ : null
    );
    const reservedUmbrella = i;

    return (
      <Container fluid className="pt-5">
        <Row>
          <Col>
            <h1 className="text-black text-left my-4">30 Aprile 2021</h1>
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={12}>
            <HomeCentralPane umbrellaList={this.state.umbrellaList}
                             splitRow={this.state.splitRow} />
          </Col>
          <Col md={2} sm={12}>
            <HomeRightPane totalUmbrella={this.state.umbrellaList.length}
                           reservedUmbrella={reservedUmbrella} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;