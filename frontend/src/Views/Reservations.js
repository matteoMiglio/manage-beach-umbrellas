import React, { Component } from "react";
import styled from 'styled-components';
import { Table, Button, Container } from 'reactstrap';

const items = [
  {
    id: 1,
    posizione: "A1",
    description: "Buy ingredients to prepare dinner",
    data: "29-04-2021"
  },
  {
    id: 2,
    posizione: "A2",
    description: "Buy ingredients to prepare dinner",
    data: "29-04-2021"
  },
  {
    id: 3,
    posizione: "B1",
    description: "Buy ingredients to prepare dinner",
    data: "29-04-2021"
  },
  {
    id: 4,
    posizione: "B2",
    description: "Buy ingredients to prepare dinner",
    data: "29-04-2021"
  },
];

class Reservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // viewCompleted: false,
      itemList: items,
      // modal: false,
    };
  }

    renderItems = () => {
      // const newItems = this.state.todoList.filter(
      //   (item) => item.completed === viewCompleted
      // );
      const newItems = this.state.itemList

      return newItems.map((item) => (
        <tr>
          <th scope="row">{item.id}</th>
          <td>{item.posizione}</td>
          <td>{item.description}</td>
          <td>{item.data}</td>
        </tr>
      ));
    }

  render() {
    return (
      <main className="container">
        <h1 className="text-black text-uppercase text-center my-4">Prenotazioni</h1>
        <div className="row">
          <div className="col-md-10 col-sm-6 mx-auto p-0">
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Posizione</th>
                  <th>Descrizione</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {this.renderItems()}
              </tbody>
            </Table>
          </div>
        </div>
      </main>
    );
  }
}

export default Reservations;