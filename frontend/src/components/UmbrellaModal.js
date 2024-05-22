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

const monthNames = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

export default class UmbrellaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSize: '',
      currentMonth: startOfMonth(new Date()),
      itemList: [],
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

  render() {
    const { toggle, onSave, onDelete, modalTitle, itemId } = this.props;

    const currentMonth = this.state.currentMonth;
    const days = [...this.range(1, new Date(new Date().getFullYear(), currentMonth.getMonth()+1, 0).getDate())];

    return (
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
      </Modal>
    );
  }
}