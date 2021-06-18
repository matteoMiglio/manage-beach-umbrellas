import React, { Component } from "react";
import { Table, Button, Label, Input, FormGroup } from 'reactstrap';
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";

const dayNames = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
const monthNames = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

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
    var validity = "";
    const item = this.props.item;
    const state = item.paid ? (
      <span style={{color: 'blue'}}>Pagato</span>
    ) : (
      <span style={{color: 'red'}}>Da pagare</span>
    );

    const deposit = item.paid ? (
      <span style={{color: '#ccc'}}>{item.deposit ? item.deposit : "0"}€</span>
    ) : (
      item.deposit ? item.deposit+"€" : "0€"
    );

    switch (item.type) {
      case "S": 
        type = "Stagionale";
        validity = item.startDate + "->" + item.endDate
        break;
      case "P":
        type = "Periodo";
        validity = item.startDate + "->" + item.endDate
        break;
      case "C":
        type = "Personalizzato";

        var days = item.custom_period.split("-")[0].split(",")
        var months = item.custom_period.split("-")[1].split(",")

        for (var i=0; i<days.length; i++) {
          validity += dayNames[days[i]]
          if (i != (days.length - 1)) 
            validity += ", "
        }

        if (months.length > 1)
          validity += " nei mesi di "
        else
          validity += " nel mese di "

        for(var i=0; i<months.length; i++) {
          validity += monthNames[months[i]]
          if (i != (months.length - 1)) 
            validity += ", "
        }

        break;
      default:
        type = "-";
    }

    return (
      <tr>
        <th scope="row">{item.code}</th>
        <td>{item.umbrella ? "#" + item.umbrella.code : "-"}</td>
        <td>{item.customer ? item.customer : "-"}</td>
        <td>{item.beachLoungers}</td>
        <td>{state}</td>
        <td>{deposit}</td>
        <td>{type}</td>
        <td>{validity}</td>
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
    const itemsUnpaid = this.props.itemsUnpaid;
    const showBeachLoungers = this.props.showBeachLoungers;
    const showUmbrellas = this.props.showUmbrellas;

    const rows = [];

    this.props.items.forEach(item => {

      /* ricerco all'interno di tutte la chiavi dell'oggetto */
      let founded = false

      if (item.customer.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
        founded = true
      }

      if (item.umbrella.code.indexOf(searchText.toLowerCase()) != -1) {
        founded = true
      }

      if (item.code.indexOf(searchText.toLowerCase()) != -1) {
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
            <th>#</th>
            <th>Ombrellone</th>
            <th>Instestatario</th>
            <th>Lettini</th>
            <th>Stato</th>
            <th>Acconto</th>
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