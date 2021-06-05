import React, { Component } from "react";
import { Table, Button, Label, Input, FormGroup } from 'reactstrap';
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";

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
    var type = null;
    const item = this.props.item;
    const state = item.paid ? (
        "Pagato"
    ) : (
        <span style={{color: 'red'}}>Da pagare</span>
    );

    switch (item.type) {
      case "S": 
        type = "Stagionale";
        break;
      case "P":
        type = "Periodo";
        break;
      case "C":
        type = "Personalizzato";
        break;
      default:
        type = "-";
    }

    return (
      <tr>
        <th scope="row">{item.code}</th>
        <td>{item.umbrella ? "#" + item.umbrella : "-"}</td>
        <td>{item.customer}</td>
        <td>{item.beachLoungers}</td>
        <td>{state}</td>
        <td>{type}</td>
        <td>{item.startDate} {"->"} {item.endDate}</td>
        <td>{item.umbrella ? <UmbrellaLogo width={25} color="black" /> : <BeachLoungerLogo width={25} color="black" />}</td>
        {/* <td align="center">{item.freePeriodList.length > 0 ? <FaCheckCircle /> : <FaMinusCircle />}</td> */}
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
            <th>Oggetto</th>
            {/* <th>Periodi liberi</th> */}
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