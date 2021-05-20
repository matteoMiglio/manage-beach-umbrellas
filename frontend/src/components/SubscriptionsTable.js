import React, { Component } from "react";
import { Table, Button, Label, Input, FormGroup } from 'reactstrap';
import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";

class DataRows extends React.Component {

  getDateString(date) {

    if (date) {
      let month = date.getMonth() + 1
      month = month > 9 ? month : "0" + month
      let day = date.getDate()
      day = day > 9 ? day : "0" + day
      return day + "-" + month + "-" + date.getFullYear() 
    }
    else
      return null
  }

  render() {
    const item = this.props.item;
    var subscriptionsType = null;
    const state = item.paid ? (
        "Pagato"
    ) : (
        <span style={{color: 'red'}}>Da pagare</span>
    );

    switch (item.subscriptionType) {
      case "seasonal": 
        subscriptionsType = "Stagionale";
        break;
      case "periodic":
        subscriptionsType = "Periodo";
        break;
      case "custom":
        subscriptionsType = "Personalizzato";
        break;
      default:
        subscriptionsType = "-";
    }

    return (
      <tr>
        <th scope="row">{item.id}</th>
        <td>{item.position}</td>
        <td>{item.customerName}</td>
        <td>{item.beachLoungers}</td>
        <td>{state}</td>
        <td>{subscriptionsType}</td>
        <td>{this.getDateString(item.startDate)} {"->"} {this.getDateString(item.endDate)}</td>
        <td align="center">{item.freePeriodList.length > 0 ? <FaCheckCircle /> : <FaMinusCircle />}</td>
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

class SubscriptionsTable extends React.Component {

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
    const itemsPaid = this.props.itemsPaid;

    const rows = [];

    this.props.items.forEach(item => {

      /* ricerco all'interno di tutte la chiavi dell'oggetto */
      let founded = false

      for (let key in item) {
        if (String(item[key]).indexOf(searchText) != -1) {
          founded = true
        }
      }

      if (!founded)
        return;

      /* filtro solo per quelli pagati */
      if (itemsPaid && !item.paid) {
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
            <th>#</th>
            <th>Ombrellone</th>
            <th>Instestatario</th>
            <th>Lettini</th>
            <th>Stato</th>
            <th>Tipo</th>
            <th>Validità</th>
            <th>Periodi liberi</th>
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

export default SubscriptionsTable;