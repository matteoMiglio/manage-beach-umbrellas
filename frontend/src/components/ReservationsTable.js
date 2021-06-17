import React, { Component } from "react";
import { Table, Button, Label, Input, FormGroup } from 'reactstrap';
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";

class DataRows extends React.Component {

    render() {
        const item = this.props.item;
        const date = item.date;
        const state = item.paid ? (
          <span style={{color: 'blue'}}>Pagato</span>
        ) : (
          <span style={{color: 'red'}}>Da pagare</span>
        );

        return (
            <tr>
                <th scope="row">{item.umbrella ? "#" + item.umbrella.code : "-"}</th>
                <td>{item.beachLoungers}</td>
                <td>{item.customer ? item.customer : "-"}</td>
                <td>{state}</td>
                <td>{date}</td>
                <td>{item.umbrella ? <UmbrellaLogo width={25} color="black" /> : <BeachLoungerLogo width={25} color="black" />}</td>
                <td>
                    <Button className="btn btn-secondary mr-2" size="sm" onClick={() => this.props.editItem(item)}>
                        Modifica
                    </Button>
                    <Button className="btn btn-danger" size="sm" onClick={() => this.props.deleteItem(item)}>
                        Rimuovi
                    </Button>
                </td>
            </tr>
        );
    }
}

class ReservationsTable extends React.Component {

  constructor(props) {
    super(props);
    this.handleEditItem = this.handleEditItem.bind(
      this
    );

    this.handleDeleteItem = this.handleDeleteItem.bind(
      this
    );
  }

  handleEditItem(e) {
    this.props.onEditButtonClick(e);
  }
  
  handleDeleteItem(e) {
    this.props.onDeleteButtonClick(e);
  }

  render() {

    const searchText = this.props.searchText;
    const itemsUnpaid = this.props.itemsUnpaid;
    const showBeachLoungers = this.props.showBeachLoungers;
    const showUmbrellas = this.props.showUmbrellas;

    const rows = [];

    this.props.items.forEach(item => {

      let founded = false

      if (item.customer.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
        founded = true
      }

      if (!founded)
        return;

      if ((item.paid == null) || (itemsUnpaid && item.paid)) {
        return;
      }

      if (showUmbrellas) {
        if (item.umbrella == null)
        return;
      }

      if (showBeachLoungers) {
        if (item.umbrella != null)
        return;
      }

      rows.push(
        <DataRows
          item={item}
          key={item.id}
          editItem={this.handleEditItem}
          deleteItem={this.handleDeleteItem}
        />
      );
    });

    return (
      <Table responsive>
        <thead align="center">
          <tr>
            <th>Ombrellone</th>
            <th>Lettini</th>
            <th>Instestatario</th>
            <th>Stato</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody align="center">
          {rows}
        </tbody>
      </Table>
    );
  }
}

export default ReservationsTable;