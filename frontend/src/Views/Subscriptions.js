import React, { Component } from "react";
import styled from 'styled-components';
import Modal from "../components/Modal";
import { Table, Button, Container, Row, Col } from 'reactstrap';

const items = [
  {
    id: 1,
    position: "A1",
    customerName: "Luca",
    beach_loungers: "1",
    startDate: "29-04-2021",
    endDate: "29-09-2021"
  },
  {
    id: 2,
    position: "A2",
    customerName: "Matteo",
    beach_loungers: "2",
    startDate: "29-04-2021",
    endDate: "29-09-2021"
  },
  {
    id: 3,
    position: "B1",
    customerName: "Luigi",
    beach_loungers: "3",
    startDate: "29-04-2021",
    endDate: "29-09-2021"
  },
  {
    id: 4,
    position: "B2",
    customerName: "Gianni",
    beach_loungers: "3",
    startDate: "29-04-2021",
    endDate: "29-09-2021"
  },
];

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //viewCompleted: false,
      itemList: items,
      modal: false,
      activeItem: {
        id: 0,
        position: "",
        customerName: "",
        startDate: "",
        endDate: ""
      },
    };
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    alert("save" + JSON.stringify(item));
  };

  createItem = () => {
    const item = { id: "", position: "", customerName: "", startDate: "", endDate: "" };

    this.setState({ activeItem: item, modal: !this.state.modal, modal_title: "Crea nuovo abbonamento" });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal, modal_title: "Modifica abbonamento" });
  };

  handleDelete = (item) => {
    alert("delete" + JSON.stringify(item));
  };

  renderItems = () => {
    // const newItems = this.state.todoList.filter(
    //   (item) => item.completed === viewCompleted
    // );
    const newItems = this.state.itemList

    return newItems.map((item) => (
      <tr>
        <th scope="row">{item.id}</th>
        <td>{item.position}</td>
        <td>{item.customerName}</td>
        <td>{item.beach_loungers}</td>
        <td>{item.startDate}</td>
        <td>{item.endDate}</td>
        <td>
          <Button className="btn btn-secondary mr-2" size="sm" onClick={() => this.editItem(item)}>
            Modifica
          </Button>
          <Button className="btn btn-danger" size="sm" onClick={() => this.handleDelete(item)}>
            Rimuovi
          </Button>
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <main className="container">
        <h1 className="text-black text-uppercase text-center my-4">Abbonamenti</h1>
        <Row>
          <Col sm={{ size: 6, order: 2, offset: 1 }} className='p-0 mb-3'>
            <Button color="primary" onClick={this.createItem}>Crea nuovo</Button>
          </Col>
        </Row>
        <div className="row">
          <div className="col-md-10 col-sm-6 mx-auto p-0">
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Posizione ombrellone</th>
                  <th>Instestatario</th>
                  <th>Lettini</th>
                  <th>Data inizio</th>
                  <th>Data fine</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.renderItems()}
              </tbody>
            </Table>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
            modal_title={this.state.modal_title}
          />
        ) : null}
      </main>
    );
  }
}

export default Subscriptions;