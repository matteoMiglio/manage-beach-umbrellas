import React, { Component, useState } from "react";
import styled from 'styled-components';
import { Table, Button, Container, Row, Col } from 'reactstrap';
import Calendar from "../components/Calendar";

import { format, subHours, startOfMonth } from 'date-fns';
import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem
} from '@zach.codes/react-calendar';

export const MyMonthlyCalendar = () => {
  let [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  return (
    <MonthlyCalendar
      currentMonth={currentMonth}
      onCurrentMonthChange={date => setCurrentMonth(date)}
    >
      <MonthlyNav />
      <MonthlyBody
        events={[
          { title: 'Call John', date: subHours(new Date(), 2) },
          { title: 'Call John', date: subHours(new Date(), 1) },
          { title: 'Meeting with Bob', date: new Date() },
        ]}
      >
        <MonthlyDay EventType
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
};

const items = [
  {
    id: 1,
    position: "A1",
    beach_loungers: "1",
  },
  {
    id: 2,
    position: "A2",
    beach_loungers: "2",
  },
  {
    id: 3,
    position: "B1",
    beach_loungers: "3",
  },
  {
    id: 4,
    position: "B2",
    beach_loungers: "3",
  },
];

class Umbrellas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //viewCompleted: false,
      itemList: items,
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

  renderItems = () => {
    // const newItems = this.state.todoList.filter(
    //   (item) => item.completed === viewCompleted
    // );
    const newItems = this.state.itemList  

    return this.calendar
  }

  render() {
    return (
      <main className="container pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Ombrelloni</h1>
        <Row>
          <Col sm={{ size: 6, order: 2, offset: 1 }} className='p-0 mb-3'>
            <Button color="primary" onClick={this.createItem}>Crea nuovo</Button>
          </Col>
        </Row>
        <div className="row">
          <div className="col-md-10 col-sm-6 mx-auto p-0">
            {/* <Calendar /> */}
          </div>
        </div>
        {/* {this.state.modal ? (
          <SubscriptionsModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
            modal_title={this.state.modal_title}
          />
        ) : null} */}
      </main>
    );
  }
}

export default Umbrellas;