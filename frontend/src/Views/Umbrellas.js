import React, { Component, useState } from "react";
import { Table, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import { format, subHours, startOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem,
  useMonthlyBody,
  eachDayOfInterval,
  MonthlyCalendarContext,
  endOfMonth,
} from '@zach.codes/react-calendar';
// import '@zach.codes/react-calendar/dist/calendar-tailwind.css';
// import '@zach.codes/react-calendar/dist/calendar-tailwind-no-reset.css';
import axios from "axios";

// export function MonthlyDay({ renderDay }) {
//   let { day, events } = useMonthlyBody();
//   let dayNumber = format(day, 'd');

//   return (
//     <div
//       key={day.toISOString()}
//       aria-label={`Events for day ${dayNumber}`}
//       className="h-48 p-2"
//       style={{ border: "2px solid rgb(229 231 235)", width: 120, height: 90 }}
//     >
//       <div className="flex justify-between">
//         <div className="font-bold">{dayNumber}</div>
//         {/* <div className="lg:hidden block">{format(day, 'EEEE')}</div> */}
//       </div>
//       <ul className="divide-gray-200 divide-y overflow-hidden max-h-36 overflow-y-auto">
//         {renderDay(events)}
//       </ul>
//     </div>
//   );
// }

class MyMonthlyCalendar extends React.Component {

  constructor(props) {
    super(props);
    this.handleMonthChange = this.handleMonthChange.bind(
      this
    );
  }

  handleMonthChange(e) {
    this.props.onMonthChange(e);
  }


  render() {

    const { itemList, currentMonth } = this.props;

    var events = [];

    itemList.forEach((element) => {
      let el = {};
      el.title = element.customer;
      el.date = new Date(element.date)
      events.push(el);
    });

    console.log(events)

    return (
      <MonthlyCalendar
        locale={it}
        currentMonth={currentMonth}
        onCurrentMonthChange={(date) => this.handleMonthChange(date)}
      >
        <MonthlyNav />
        <MonthlyBody
          events={events}
        >
          <MonthlyDay
            renderDay={(data) =>
              data.map((item, index) => (
                <DefaultMonthlyEventItem
                  key={index}
                  title={item.title}
                  // Format the date here to be in the format you prefer
                  // date={format(item.date, 'k:mm')}
                />
              ))
            }
          />
        </MonthlyBody>
      </MonthlyCalendar>
    );
  }
}

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

class ProvaCalendar extends Component {
  constructor(props) {
    super(props);
  }

  renderSingleRow = (items) => {
    const row = [];

    if (items.length < 7)
      items = items.concat(Array(7-items.length).fill("0"));

    // console.log(items)

    items.slice(0, items.length).forEach((item, index) => {
      if (typeof(item) === "object") {
        console.log("primo if")
        row.push( 
          <td key={index} style={{ width: 120, backgroundColor: item ? "lightcoral" : "lightgreen" }}>
            {item ? item.date.split("-")[2] : ""}
          </td>
        );
      } else {
        console.log("secondo if")
        row.push( 
          <td key={index} style={{ width: 120}}>
            {item}
          </td>
        );    
      }  
    });

    return row;
  }

  render() {

    var array = []

    // if (this.state.itemList.length > 0)
    array = this.props.itemList;
    // else
    //   array = [...this.range(1, 31)];

    const matrix = [];
    const calendar = [];

    while (array.length > 0)
      matrix.push(array.splice(0, 7));
    
    console.log(matrix);

    matrix.slice(0, matrix.length).map((row, index) => {
      calendar.push(
        <tr key={index} style={{ height: 90 }}>
          {this.renderSingleRow(row)}
        </tr>
      );
    });

    return (
      <Table bordered>
        <thead>
          <tr>
            <th>Lunedì</th>
            <th>Martedì</th>
            <th>Mercoledì</th>
            <th>Giovedì</th>
            <th>Venerdì</th>
            <th>Sabato</th>
            <th>Domenica</th>
          </tr>
        </thead>
        <tbody>
          {calendar}
        </tbody>
      </Table>
    );
  }
}

class Umbrellas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: startOfMonth(new Date()),
      umbrellaList: [],
      itemList: [],
      umbrellaCode: 1
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

    trackPromise(
      axios
        .get(`/api/reservations/?start_date=${startDayOfMonth}&end_date=${endDayOfMonth}&umbrella_code=${this.state.umbrellaCode}`)
        .then((res) => {
          this.setState({ itemList: res.data })
          console.log(res.data)
        })
        .catch((err) => console.log(err))
    );

    axios
      .get("/api/umbrellas/")
      .then((res) => this.setState({ umbrellaList: res.data }))
      .catch((err) => console.log(err));
  };

  setCurrentMonth = (month) => {

    const currentMonth = month;
    this.setState({ currentMonth }, () => this.refreshList());
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
    this.setState({ umbrellaCode }, () => this.refreshList());
  };

  range = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }

  renderSingleRow = (items) => {
    const row = [];

    if (items.length < 7)
      items = items.concat(Array(7-items.length).fill("0"));

    // console.log(items)

    items.slice(0, items.length).forEach((item, index) => {
      if (typeof(item) === "object") {
        console.log("primo if")
        row.push( 
          <td key={index} style={{ width: 120, backgroundColor: item ? "lightcoral" : "lightgreen" }}>
            {item ? item.date.split("-")[2] : ""}
          </td>
        );
      } else {
        console.log("secondo if")
        row.push( 
          <td key={index} style={{ width: 120}}>
            {item}
          </td>
        );    
      }  
    });

    return row;
  }

  render() {

    var array = []

    // if (this.state.itemList.length > 0)
    array = this.state.itemList;
    // else
    //   array = [...this.range(1, 31)];

    const matrix = [];
    const calendar = [];

    while (array.length > 0)
      matrix.push(array.splice(0, 7));
    
    console.log(matrix);

    matrix.slice(0, matrix.length).map((row, index) => {
      calendar.push(
        <tr key={index} style={{ height: 90 }}>
          {this.renderSingleRow(row)}
        </tr>
      );
    });

    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Ombrelloni</h1>
        <Row>
          <Col sm={{ size: 6, order: 2, offset: 1 }} className='p-0 mb-3'>
            <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>Ombrellone</Label>
                  <Col sm={6}>
                    <Input type="select" name="umbrella" id="position-id" onChange={(item) => this.handleSubmit(item)}>
                      {this.renderUmbrellaSelection()}
                    </Input>
                  </Col>
                </FormGroup>
              </Form>
          </Col>
        </Row>
        <Row><LoadingIndicator/></Row>
        <Row>
          <Col md={10} sm={12} className="mx-auto p-0">
          <ProvaCalendar itemList={this.state.itemList} ref={el => (this.componentRef = el)} />
            {/* <MyMonthlyCalendar currentMonth={this.state.currentMonth}
                               itemList={this.state.itemList}
                               onMonthChange={this.setCurrentMonth} /> */}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Umbrellas;