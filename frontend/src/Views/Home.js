import React, { Component } from "react";
import styled from 'styled-components';
import Umbrella from "../components/Umbrella";
import { Table, Button, Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FaUmbrellaBeach } from 'react-icons/fa';

const umbrella = [
  {
    id: 1,
    position: "A1",
    row: "1",
    column: "1",
    beach_loungers: "2"
  },
  {
    id: 2,
    position: "A2",
    row: "1",
    column: "2",
    beach_loungers: "4"
  },
  {
    id: 3,
    position: "B1",
    row: "2",
    column: "1",
    beach_loungers: "3"
  },
  {
    id: 4,
    position: "B2",
    row: "2",
    column: "2",
    beach_loungers: "1"
  },
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //viewCompleted: false,
      umbrellaList: umbrella,
      modal: false,
      activeItem: {
        id: 0,
        position: "",
        row: "",
        column: "",
        beach_loungers: ""
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

  renderItems = () => {
    // const newItems = this.state.todoList.filter(
    //   (item) => item.completed === viewCompleted
    // );
    const newItems = this.state.umbrellaList

    const len = Math.ceil(newItems / 2)

    return newItems.map((item1, item2) => (
      <tr>
        <td>
          <FaUmbrellaBeach />{item1.position}
        </td>
        <td>
          <FaUmbrellaBeach />{item2.position}
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <main className="container">
        <h1 className="text-black text-left my-4">30 Aprile 2021</h1>
        <div className="row">
          <div className="col-md-10 col-sm-12">
            <Table responsive borderless>
              <tbody>
                {/* <tr>  
                  <Umbrella></Umbrella>
                </tr> */}
                <tr className='mb-2'>
                  <td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td>
                </tr>
                <tr className='mb-2'>
                  <td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td>
                </tr>
                <tr className='mb-2'>
                  <td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td>
                </tr>
                <tr className='mb-2'>
                  <td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td>
                </tr>
                <tr className='mb-2'>
                  <td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td>
                  </tr>
                <tr className='mb-2'>
                  <td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td>
                </tr>
                <tr className='mb-2'>
                  <td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td><td><FaUmbrellaBeach /></td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="col-md-2 cols-sm-12">
            <Row>
              <Col lg="12" className='mb-5'>
                <h4>Ombrelloni Totali</h4>
                <h5 className="text-center mt-4">10</h5>
              </Col>
              <Col lg="12" className='mb-5'>
                <h4>Ombrelloni Occupati</h4>
                <h5 className="text-center mt-4">4</h5>
              </Col>
              <Col lg="12" className='mb-5'>
                <h4>Ombrelloni Liberi</h4>
                <h5 className="text-center mt-4">6</h5>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    );
  }
}

export default Home;