import React, { Component } from "react";
import { Table, Button, Label, Input, FormGroup } from 'reactstrap';

class DataRows extends React.Component {

    sendEditItem(e) {
        this.props.editItem(e);
    }
    
    sendDeleteItem(e) {
        this.props.deleteItem(e);
    }

    render() {
        const item = this.props.item;
        const state = item.paid ? (
            "Pagato"
        ) : (
            <span style={{color: 'red'}}>Da pagare</span>
        );
    
        return (
            <tr>
                <th scope="row">{item.id}</th>
                <td>{item.position}</td>
                <td>{item.customerName}</td>
                <td>{item.beach_loungers}</td>
                <td>{state}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>
                    <Button className="btn btn-secondary mr-2" size="sm" onClick={() => this.sendEditItem(item)}>
                        Modifica
                    </Button>
                    <Button className="btn btn-danger" size="sm" onClick={() => this.sendDeleteItem(item)}>
                        Rimuovi
                    </Button>
                </td>
            </tr>
        );
    }
}

class DataTable extends React.Component {

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
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ombrellone</th>
                        <th>Instestatario</th>
                        <th>Lettini</th>
                        <th>Stato</th>
                        <th>Data inizio</th>
                        <th>Data fine</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        );
    }
}

export default DataTable;