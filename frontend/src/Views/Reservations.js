import React, { Component } from "react";
import { Row, Col, Button, Container } from 'reactstrap';
import ReservationsTable from '../components/ReservationsTable';
import ReservationsModal from '../components/ReservationsModal';
import ReservationsSearchBar from '../components/ReservationsSearchBar';
import axios from "axios";

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
      itemList: [],
      modal: false,
      filterDate: new Date(),
      showAll: false,
      itemsUnpaid: false
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {

    let tmp = this.state.filterDate.toISOString();
    const filterDate = tmp.substring(0, tmp.indexOf('T'));

    axios
      .get("/api/reservations?date=" + filterDate)
      .then((res) => this.setState({ itemList: res.data }))
      .catch((err) => console.log(err));
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/reservations/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }

    axios
      .post("/api/reservations/", item)
      .then((res) => this.refreshList());
  };

  toggle = () => {
    this.setState({ 
      modal: !this.state.modal 
    });
  };

  createItem = () => {
    let tmp = this.state.filterDate.toISOString();
    const newDate = tmp.substring(0, tmp.indexOf('T'));
    const item = { umbrella: "", 
                  customer: "",
                  beachLoungers: 1,
                  date: newDate, 
                  paid: false };

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Crea nuova prenotazione" 
    });
  };

  editItem = (item) => {
    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Modifica prenotazione" 
    });
  };

  deleteItem = (item) => {
    axios
      .delete(`/api/reservations/${item.id}/`)
      .then((res) => this.refreshList());
  }

  handleFilterDateChange = (e) => {
    const date = new Date(e);
    this.setState({
      filterDate: date,
    });

    setTimeout(() => { this.refreshList() }, 50);
  }

  handleShowUnpaidChange = (paid) => {

    this.setState({
      itemsUnpaid: paid,
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
                                   onUnpaidItemsChange={this.handleShowUnpaidChange} 
                                   filterDate={this.state.filterDate}
                                   itemsUnpaid={this.state.itemsUnpaid}
                                   showAll={this.state.showAll} />
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={6} className="mx-auto p-0">
            <ReservationsTable items={this.state.itemList}
                               showAll={this.state.showAll}
                               itemsUnpaid={this.state.itemsUnpaid}
                               filterDate={this.state.filterDate} 
                               onEditButtonClick={this.editItem} 
                               onDeleteButtonClick={this.deleteItem} />
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