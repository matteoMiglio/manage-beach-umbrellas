import React, { Component } from "react";
import { startOfMonth, subMonths, addMonths } from 'date-fns';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Col,
  Container,
  Row
} from "reactstrap";
import axios from "axios";
import MyCalendar from "./MyCalendar";
import SubscriptionsModal from "./SubscriptionsModal";
import ReservationsModal from "./ReservationsModal";
import Notification from "../components/Notification";

const monthNames = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

const createEmptySubscriptionItem = () => {
  const item = {
    umbrella: "",
    customer: "",
    sunbeds: 2,
    start_date: null,
    end_date: null,
    type: "",
    paid: false,
    deposit: null,
    total: null,
    customDays: [],
    customMonths: [],
  }

  return item;
}

const createEmptyReservationItem = () => {
  const item = { 
    umbrella: "", 
    customer: "",
    sunbeds: 2,
    date: "", 
    paid: false 
  }

  return item;
}

export default class UmbrellaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: startOfMonth(new Date()),
      itemList: [],
      activeItemSubscription: createEmptySubscriptionItem(),
      activeItemReservation: createEmptyReservationItem(),
      subscriptionModal: false,
      reservationModal: false,
      myAlert: {show: false, title: "Notifica", text: "", backgroundColor: ""},
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
  
    const currentMonth = this.state.currentMonth.getMonth();
    const currentYear = new Date().getFullYear();
    const d = new Date(currentYear, currentMonth + 1, 0);
    const endDay = d.getDate();

    const startDayOfMonth = currentYear + "-" + (currentMonth+1) + "-1";
    const endDayOfMonth = currentYear + "-" + (currentMonth+1) + "-" + endDay;

    axios
      .get(`/api/reservations/?start_date=${startDayOfMonth}&end_date=${endDayOfMonth}&umbrella_code=${this.props.itemId}`)
      .then((res) => (this.setState({ itemList: res.data })))
      .catch((err) => console.log(err))
  };

  setCurrentMonth = (month) => {

    const currentMonth = month;
    this.setState({ currentMonth });

    setTimeout(() => { this.refreshList() }, 50);
  }

  range = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }

  handleToggleNestedSubscriptionModal = () => {

    const item = { ...this.state.activeItemSubscription, ['umbrella']: this.props.itemId }

    this.setState({ 
      subscriptionModal: !this.state.subscriptionModal,
      activeItemSubscription: item
    });
  }
  
  handleToggleNestedReservationModal = () => {
    const today = new Date().toISOString().substring(0, 10);
    const item = { ...this.state.activeItemReservation, ['date']: today, ['umbrella']: this.props.itemId }
    this.setState({ 
      reservationModal: !this.state.reservationModal,
      activeItemReservation: item
    });
  }

  handleSubmitSubscription = (item, method) => {
    this.handleToggleNestedSubscriptionModal();

    if (method.includes("save")) {
      if (item.umbrella === "" || item.umbrella === "-") {
        item.umbrella = null;
      }

      if (item.total === "") {
        item.total = null
      }

      if (item.deposit === "") {
        item.deposit = null
      }

      if (item.paid === "on")
        item.paid = true;

      axios
        .post("/api/subscriptions/", item)
        .then((res) => {
          this.refreshList();
          
          this.updateAlert("Inserimento avvenuto con successo", "lightgreen");
          this.toggleAlert();

          if (method.includes("print")) {
            item.code = res.data.code;
            this.printTicket(item, 'subscription');
          }
        })
        .catch((err) => {
          console.log(err)
          this.updateAlert("Inserimento fallito", "lightcoral");
          this.toggleAlert();
        });
    }
  }

  handleSubmitReservation = (item, method) => {
    this.handleToggleNestedReservationModal();

    if (method.includes("save")) {

      if (item.umbrella === "" || item.umbrella === "-") {
        item.umbrella = null;
      }

      axios
        .post("/api/reservations/", item)
        .then((res) => {
          this.refreshList();

          this.updateAlert("Inserimento avvenuto con successo", "lightgreen");
          this.toggleAlert();

          if (method.includes("print")) {
            item.code = res.data.code;
            this.printTicket(item, 'reservation');
          } 
        })
        .catch((err) => {
          console.log(err)
          this.updateAlert("Inserimento fallito", "lightcoral");
          this.toggleAlert();
        });
    }
  };

  printTicket = (item, type) => {

    const obj = {}
    if (type === 'subscription') {
      obj = {
        type: "subscription",
        sunbeds: item.sunbeds,
        umbrella: item.umbrella,
        code: item.code,
        start_date: item.start_date,
        end_date: item.end_date,
        subscription_type: item.type,
        custom_period: item.custom_period
      }
    } else {
      obj = {
        type: "reservation",
        code: item.code,
        sunbeds: item.sunbeds,
        umbrella: item.umbrella
      }
    }

    axios
      .post("/api/printer/ticket/", obj)
      .then((res) => console.log(res.data));
  }

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

  render() {
    const { toggle, modalTitle, itemId } = this.props;

    const currentMonth = this.state.currentMonth;
    const days = [...this.range(1, new Date(new Date().getFullYear(), currentMonth.getMonth()+1, 0).getDate())];

    return (
      <Container>
        <Notification 
          // onToggle={this.toggleAlert}
          show={this.state.myAlert.show}
          title={this.state.myAlert.title}
          text={this.state.myAlert.text}
          backgroundColor={this.state.myAlert.backgroundColor}
        />
        <Modal isOpen={true} toggle={toggle} size="xl">
          <ModalHeader toggle={toggle}>{modalTitle} ombrellone numero: {itemId}</ModalHeader>
          <ModalBody>
            <Container>
              <Row className="d-flex justify-content-center align-items-center"> 
                <div className="mb-4">
                  <Button size="sm" onClick={() => this.setCurrentMonth(subMonths(currentMonth, 1))}>
                    Precedente
                  </Button>
                </div>
                <div className="mx-4 mb-4" aria-label="Current Month">
                  {monthNames[currentMonth.getMonth()+1]}
                </div>
                <div className="mb-4">
                  <Button size="sm" onClick={() => this.setCurrentMonth(addMonths(currentMonth, 1))}>
                    Prossimo
                  </Button>
                </div>
              </Row>
              <Row>
                <Col md={10} sm={12} className="mx-auto p-0">
                  <MyCalendar days={days} data={this.state.itemList} currentMonth={this.state.currentMonth} />
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleToggleNestedSubscriptionModal}>
              Crea abbonamento
            </Button>
            <Button color="info" onClick={this.handleToggleNestedReservationModal}>
              Prenota per oggi
            </Button>
            {this.state.subscriptionModal ? (
              <SubscriptionsModal
                activeItem={this.state.activeItemSubscription}
                toggle={this.handleToggleNestedSubscriptionModal}
                onSave={(item, method) => this.handleSubmitSubscription(item, method)}
                modalTitle="Crea nuovo abbonamento"
              />
            ) : null}
            {this.state.reservationModal ? (
              <ReservationsModal
                activeItem={this.state.activeItemReservation}
                toggle={this.handleToggleNestedReservationModal}
                onSave={(item, method) => this.handleSubmitReservation(item, method)}
                modalTitle="Crea nuova prenotazione"
              />
            ) : null}
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}