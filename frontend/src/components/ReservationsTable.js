import React, { Component } from "react";
import { Table, Button, Label, Input, FormGroup } from 'reactstrap';

class DataRows extends React.Component {

    render() {
        const item = this.props.item;
        const state = item.paid ? (
            "Pagato"
        ) : (
            <span style={{color: 'red'}}>Da pagare</span>
        );
    
        const date = item.date;

        return (
            <tr>
                <th scope="row">{item.umbrella}</th>
                <td>{item.customer ? item.customer : "-"}</td>
                <td>{item.beachLoungers}</td>
                <td>{state}</td>
                <td>{date}</td>
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

    const filterDate = this.props.filterDate;
    const showAll = this.props.showAll;
    const itemsUnpaid = this.props.itemsUnpaid;

    const rows = [];

    this.props.items.forEach(item => {

      /* filtro solo per la data selezionata */
      // if (!showAll) {

      //   if (filterDate && (filterDate.toDateString() != item.date.toDateString())) {
      //     return;
      //   }
      // }

      if ((item.paid == null) || (itemsUnpaid && item.paid)) {
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
            <th>Instestatario</th>
            <th>Lettini</th>
            <th>Stato</th>
            <th>Data</th>
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