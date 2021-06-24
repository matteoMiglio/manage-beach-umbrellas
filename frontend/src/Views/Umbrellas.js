import React, { Component, useState } from "react";
import { Table, Button, Container, Row, Col } from 'reactstrap';
import { format, subHours, startOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem,
} from '@zach.codes/react-calendar';
// import '@zach.codes/react-calendar/dist/calendar-tailwind.css';

class MyMonthlyCalendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMonth: startOfMonth(new Date())
    };
  }

  setCurrentMonth = (month) => {

    const currentMonth = month;
    this.setState({ currentMonth });
  }

  render() {
    return (
      <MonthlyCalendar
        locale={it}
        currentMonth={this.state.currentMonth}
        onCurrentMonthChange={date => this.setCurrentMonth(date)}
      >
        <MonthlyNav />
        <MonthlyBody
          events={[
            { title: 'Call John', date: subHours(new Date(), 2) },
            { title: 'Call John', date: subHours(new Date(), 1) },
            { title: 'Meeting with Bob', date: new Date() },
          ]}
        >
          <MonthlyDay
            renderDay={data =>
              data.map((item, index) => (
                <DefaultMonthlyEventItem
                  key={index}
                  title={item.title}
                  // Format the date here to be in the format you prefer
                  date={format(item.date, 'k:mm')}
                />
              ))
            }
          />
        </MonthlyBody>
      </MonthlyCalendar>
    );
  }
}


class Umbrellas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //viewCompleted: false,
      // itemList: items,
      modal: false,
      activeItem: {
        id: 0,
        position: "",
        beach_loungers: "",
      },
    };
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    alert("save" + JSON.stringify(item));
  };

  createItem = () => {
    const item = { id: "", position: "", customerName: "", startDate: "", endDate: "" };

    this.setState({ activeItem: item, modal: !this.state.modal, modal_title: "Crea nuovo ombrellone" });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal, modal_title: "Modifica ombrellone" });
  };

  handleDelete = (item) => {
    alert("delete" + JSON.stringify(item));
  };

  render() {
    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Ombrelloni</h1>
        <Row>
          <Col sm={{ size: 6, order: 2, offset: 1 }} className='p-0 mb-3'>
            <Button color="primary" onClick={this.createItem}>Crea nuovo</Button>
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={12} className="mx-auto p-0">
            <MyMonthlyCalendar />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Umbrellas;