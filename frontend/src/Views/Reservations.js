import React, { Component } from "react";
import { Row, Col, Container } from 'reactstrap';
import ReservationsTable from '../components/ReservationsTable';
import ReservationsModal from '../components/ReservationsModal';
import ReservationsSearchBar from '../components/ReservationsSearchBar';
import Notification from "../components/Notification";
import axios from "axios";
import { Fab } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { GrFormAdd } from "react-icons/gr";

const mainButtonStyles = {
  backgroundColor: '#ab50e4',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
}

class Reservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      currentItems: [],
      modal: false,
      myAlert: {show: false, title: "Notifica", text: "", backgroundColor: ""},
      filterDate: new Date(),
      searchText: '',
      itemsUnpaid: false,
      showUmbrellas: false,
      showSunbeds: false,
      currentPage: 1, 
      totalPages: null,
      pageLimit: 10,
      isLoading: true
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {

    let tmp = this.state.filterDate.toISOString();
    const filterDate = tmp.substring(0, tmp.indexOf('T'));

    axios
      .get("/api/reservations/?date=" + filterDate)
      .then((res) => {
        this.setState({ itemList: res.data });
      })
      .catch((err) => console.log(err))
      .finally(() => (this.setState({ isLoading: false })))
  };

  handleSubmit = (item, method) => {
    this.toggle();

    if (method.includes("save")) {

      if (item.umbrella === "" || item.umbrella === "-") {
        item.umbrella = null;
      }
  
      if (item.id) {
        axios
          .put(`/api/reservations/${item.id}/`, item)
          .then((res) => {
            this.refreshList();
            
            this.updateAlert("Modifica avvenuta con successo", "lightgreen")
            this.toggleAlert();
          })
          .catch((err) => {
            console.log(err)
            this.updateAlert("Modifica fallita", "lightcoral");
            this.toggleAlert();
          });
        return;
      }

      axios
        .post("/api/reservations/", item)
        .then((res) => {
          this.refreshList();

          this.updateAlert("Inserimento avvenuto con successo", "lightgreen");
          this.toggleAlert();
        })
        .catch((err) => {
          console.log(err)
          this.updateAlert("Inserimento fallito", "lightcoral");
          this.toggleAlert();
        });
    }

    if (method.includes("print")) {
      const obj = {
        type: "reservation",
        sunbeds: item.sunbeds,
        umbrella: item.umbrella
      }
  
      axios
        .post("/api/printer/ticket/", obj)
        .then((res) => console.log(res.data));
    }
  };

  toggle = () => {
    this.setState({ 
      modal: !this.state.modal 
    });
  };

  updateAlert = (text, color) => {
    var myAlert = {...this.state.myAlert};
    myAlert.text = text;
    myAlert.backgroundColor = color;
    
    this.setState({ myAlert })
  }

  toggleAlert = () => {
    let myAlert = {...this.state.myAlert};
    myAlert.show = !myAlert.show;

    this.setState({ myAlert }, () => {
      window.setTimeout(() => {
        let myAlert = {...this.state.myAlert};
        myAlert.show = !myAlert.show;
        this.setState({ myAlert })
      }, 4000)
    });
  };

  createItem = () => {
    let tmp = this.state.filterDate.toISOString();
    const newDate = tmp.substring(0, tmp.indexOf('T'));
    const item = { umbrella: "", 
                  customer: "",
                  sunbeds: 1,
                  date: newDate, 
                  paid: false };

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modalTitle: "Crea nuova prenotazione" 
    });
  };

  editItem = (item) => {
    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modalTitle: "Modifica prenotazione" 
    });
  };

  deleteItem = (item) => {

    this.toggle();

    axios
      .delete(`/api/reservations/${item.id}/`)
      .then((res) => {
        this.updateAlert("Eliminazione avvenuta con successo", "lightgreen")
        this.toggleAlert();

        this.refreshList();
      })
      .catch((err) => {
        console.log(err);
        this.updateAlert("Eliminazione fallita", "lightcoral")
        this.toggleAlert();
      });
  }

  handleFilterDateChange = (e) => {
    const date = new Date(e);
    this.setState({
      filterDate: date,
    });

    setTimeout(() => { this.refreshList() }, 50);
  }

  handleFilterTextChange = (text) => {
    this.setState({
      searchText: text,
    });
  }

  handleShowUnpaidChange = (paid) => {

    this.setState({
      itemsUnpaid: paid,
    });
  }

  handleShowUmbrellaChange = (el) => {

    this.setState({
      showUmbrellas: el,
    });
  }

  handleShowSunbedsChange = (el) => {

    this.setState({
      showSunbeds: el,
    });
  }

  renderFloatingActionButton = () => {
    return (
      <Fab
        mainButtonStyles={mainButtonStyles}
        icon={<GrFormAdd />}
        event="click"
        onClick={() => this.createItem()}
        alwaysShowTitle={false}
      />
    );
  };

  render() {

    if (this.state.isLoading) return null;

    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Prenotazioni</h1>
        <Notification 
          // onToggle={this.toggleAlert}
          show={this.state.myAlert.show}
          title={this.state.myAlert.title}
          text={this.state.myAlert.text}
          backgroundColor={this.state.myAlert.backgroundColor}
        />
        <Row>
          <Col sm={{ size: 11, offset: 1}} className='mb-3'>
            <ReservationsSearchBar onFilterDateChange={this.handleFilterDateChange}
                                   onFilterTextChange={this.handleFilterTextChange}
                                   onUnpaidItemsChange={this.handleShowUnpaidChange} 
                                   onShowUmbrellasChange={this.handleShowUmbrellaChange} 
                                   onShowSunbedsChange={this.handleShowSunbedsChange} 
                                   filterDate={this.state.filterDate}
                                   itemsUnpaid={this.state.itemsUnpaid}
                                   searchText={this.state.searchText}
                                   showSunbeds={this.state.showSunbeds}
                                   showUmbrellas={this.state.showUmbrellas} />
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={6} className="mx-auto p-0">
            <ReservationsTable totalItems={this.state.itemList}
                               searchText={this.state.searchText} 
                               itemsUnpaid={this.state.itemsUnpaid}
                               showSunbeds={this.state.showSunbeds}
                               showUmbrellas={this.state.showUmbrellas} 
                               onEditButtonClick={this.editItem} 
                               onDeleteButtonClick={this.deleteItem} />
          </Col>
        </Row>
        {this.renderFloatingActionButton()}
        {this.state.modal ? (
          <ReservationsModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={(item, method) => this.handleSubmit(item, method)}
            onDelete={this.deleteItem}
            modalTitle={this.state.modalTitle}
          />
        ) : null}
      </Container>
    );
  }
}

export default Reservations;