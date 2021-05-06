import React, { Component, ForwardedRef } from "react";
import { Form, Button, Label, Input, FormGroup } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class ReservationsSearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.handleFilterDateChange = this.handleFilterDateChange.bind(
        this
    );
    this.handleShowAllChange = this.handleShowAllChange.bind(
      this
  );
  }

  // handleFilterDateChange(e) {
  //   this.props.onFilterDateChange(e.target.value);
  // }

  handleFilterDateChange(date) {
    this.props.onFilterDateChange(date);
  }

  handleShowAllChange(e) {
    this.props.onShowAllChange(e.target.checked);
  }

  getDateString(date) {

    if (date) {
      let month = date.getMonth() + 1
      month = month > 9 ? month : "0" + month
      let day = date.getDate()
      day = day > 9 ? day : "0" + day
      return date.getFullYear() + "-" + month + "-" + day
    }
    else
      return null
  }

  render() {
    const months = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "September",
      "October",
      "November",
      "December"
    ];
    const CustomInputDatePicker = React.forwardRef(
      ({ value, onClick }, ref) => (
        <Button color="info" onClick={onClick} ref={ref}>
          {value}
        </Button>
      )
    );

    //const filterDate = this.getDateString(this.props.filterDate);
    const filterDate = this.props.filterDate;
    const showAll = this.props.showAll;

    return (
      <Form inline>
        {/* <FormGroup className="mb-2 mx-sm-2 mb-sm-0">
          <Label className="mr-sm-2">Ricerca Data</Label>
          <Input type="date" name="date"
                 value={filterDate} onChange={this.handleFilterDateChange} />
        </FormGroup> */}
        <DatePicker
          todayButton="Oggi"
          locale="it-IT"
          selected={filterDate}
          onChange={(date) => this.handleFilterDateChange(date)}
          customInput={<CustomInputDatePicker />}
        />
        <FormGroup className="mb-2 mx-sm-2 mb-sm-0" check>
          <Input type="checkbox" name="check" id="exampleCheck" 
                 checked={showAll} onChange={this.handleShowAllChange} />
          <Label for="exampleCheck" check>Mostra tutte</Label>
        </FormGroup>
      </Form>
    );
  }
}

export default ReservationsSearchBar;