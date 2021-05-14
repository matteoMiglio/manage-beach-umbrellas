import React, { Component } from "react";
import { Row, Col, Button, Container } from 'reactstrap';
import ReservationsTable from '../components/ReservationsTable';
import ReservationsModal from '../components/ReservationsModal';
import ReservationsSearchBar from '../components/ReservationsSearchBar';

const items = [
  {
    id: 1001,
    position: "A1",
    customerName: "Luca",
    beach_loungers: "1",
    date: new Date(2021, 4, 1),
    paid: true,
  },
  {
    id: 1002,
    position: "A2",
    customerName: "-",
    beach_loungers: "2",
    date: new Date(2021, 4, 4),
    paid: true,
  },
  {
    id: 1003,
    position: "B1",
    customerName: "Luigi",
    beach_loungers: "3",
    date: new Date(2021, 4, 3),
    paid: false,
  },
  {
    id: 1004,
    position: "B2",
    customerName: "Gianni",
    beach_loungers: "3",
    date: new Date(2021, 4, 2),
    paid: false
  },
  {
    id: 1005,
    position: "-",
    customerName: "Gianni",
    beach_loungers: "2",
    date: new Date(2021, 4, 2),
    paid: true,
  }
];

class Reservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: items,
      modal: false,
      filterDate: new Date(),
      showAll: false
    };
  }

  toggle = () => {
    this.setState({ 
      modal: !this.state.modal 
    });
  };

  createItem = () => {
    const item = { id: "", 
                  position: "", 
                  customerName: "",
                  beach_loungers: 1,
                  date: "", 
                  paid: false };

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Crea nuova prenotazione" 
    });
  };

  handleFilterDateChange = (e) => {
    const date = new Date(e)
    this.setState({
      filterDate: date,
    });
  }

  handleShowAllChange = (e) => {

    this.setState({
      showAll: e,
    });
  }

  render() {
    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Prenotazioni</h1>
        <Row>
          <Col sm={{ size: 3, offset: 1 }} className='mb-3'>
            <Button color="primary" onClick={() => this.createItem()}>Nuova prenotazione</Button>
          </Col>
          <Col sm={8}>
            <ReservationsSearchBar onFilterDateChange={this.handleFilterDateChange}
                                   onShowAllChange={this.handleShowAllChange}
                                   filterDate={this.state.filterDate}
                                   showAll={this.state.showAll} />
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={6} className="mx-auto p-0">
            <ReservationsTable items={this.state.itemList}
                               showAll={this.state.showAll}
                               filterDate={this.state.filterDate} 
                               onEditButtonClick={this.handleEditButtonClick} 
                               onDeleteButtonClick={this.handleDeleteButtonClick} />
          </Col>
        </Row>
        {this.state.modal ? (
          <ReservationsModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
            modal_title={this.state.modal_title}
          />
        ) : null}
      </Container>
    );
  }
}

export default Reservations;