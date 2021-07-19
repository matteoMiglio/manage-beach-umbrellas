import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Container, Row, Col, Button } from 'reactstrap';
import { startOfMonth, subMonths, addMonths } from 'date-fns';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import MyCalendar from "../components/MyCalendar";
import axios from "axios";

const monthNames = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && 
      <div
        style={{
          width: "100%",
          height: "100",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Loader type="TailSpin" color="#774876" height={80} width={80}/>
      </div>
  );  
}

class Umbrellas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: startOfMonth(new Date()),
      umbrellaList: [],
      itemList: [],
      umbrellaCode: 1,
      isLoading: true
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = async () => {
    
    const currentMonth = this.state.currentMonth.getMonth();
    const currentYear = new Date().getFullYear();
    const d = new Date(currentYear, currentMonth + 1, 0);
    const endDay = d.getDate();

    const startDayOfMonth = currentYear + "-" + (currentMonth+1) + "-1";
    const endDayOfMonth = currentYear + "-" + (currentMonth+1) + "-" + endDay;

    trackPromise(
      axios
        .get(`/api/reservations/?start_date=${startDayOfMonth}&end_date=${endDayOfMonth}&umbrella_code=${this.state.umbrellaCode}`)
        .then((res) => (this.setState({ itemList: res.data })))
        .catch((err) => console.log(err))
    );

    axios
      .get("/api/umbrellas/")
      .then((res) => this.setState({ umbrellaList: res.data }))
      .catch((err) => console.log(err));
  };

  setCurrentMonth = (month) => {

    const currentMonth = month;
    this.setState({ currentMonth });

    setTimeout(() => { this.refreshList() }, 50);
  }

  renderUmbrellaSelection = () => {

    const list = this.state.umbrellaList;

    return list.map((item, index) => (
      <option key={index} selected={item.code == this.state.umbrellaCode}>
        {item.code}
      </option>
    ));
  }

  handleSubmit = (item) => {

    let umbrellaCode = { ...this.state.umbrellaCode};
    umbrellaCode = item.target.value;
    this.setState({ umbrellaCode });

    setTimeout(() => { this.refreshList() }, 50);
  };

  range = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }

  render() {

    const currentMonth = this.state.currentMonth;
    const days = [...this.range(1, new Date(new Date().getFullYear(), currentMonth.getMonth()+1, 0).getDate())];

    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Ombrelloni</h1>
        <Row>
          <Col sm={{ size: 6, order: 2, offset: 1 }} className='p-0 mb-3'>
            <Form>
              <FormGroup row>
                <Label for="exampleSelect" xs={3}>Ombrellone</Label>
                <Col xs={3}>
                  <Input type="select" name="umbrella" id="position-id" onChange={(item) => this.handleSubmit(item)}>
                    {this.renderUmbrellaSelection()}
                  </Input>
                </Col>
                </FormGroup>
            </Form>

            <Row style={{ position: "absolute", top: 5, right: "-68%", marginRight: 10 }}>
              <div className="flex justify-end mb-4">
                <Button size="sm" onClick={() => this.setCurrentMonth(subMonths(currentMonth, 1))}>
                  Precedente
                </Button>
              </div>
              <div className="ml-4 mr-4 w-32 mt-1 text-center" aria-label="Current Month">
                {monthNames[currentMonth.getMonth()+1]}
              </div>
              <div className="flex justify-end mb-4">
                <Button size="sm" onClick={() => this.setCurrentMonth(addMonths(currentMonth, 1))}>
                  Prossimo
                </Button>
              </div>
            </Row>

          </Col>
        </Row>
        <Row><LoadingIndicator/></Row>
        <Row>
          <Col md={10} sm={12} className="mx-auto p-0">
            <MyCalendar days={days} data={this.state.itemList} currentMonth={this.state.currentMonth} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Umbrellas;