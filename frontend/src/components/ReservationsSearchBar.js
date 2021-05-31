import React, { Component, ForwardedRef } from "react";
import { Form, Button, Label, Input, FormGroup } from 'reactstrap';
import DatePicker, { registerLocale, setDefaultLocale, getDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import it from 'date-fns/locale/it';
registerLocale('it', it);

class ReservationsSearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.handleFilterDateChange = this.handleFilterDateChange.bind(
        this
    );
    this.handleShowUnpaidChange = this.handleShowUnpaidChange.bind(
      this
    );
    this.handleShowAllChange = this.handleShowAllChange.bind(
      this
    );
  }

  handleFilterDateChange(date) {
    this.props.onFilterDateChange(date);
  }

  handleShowUnpaidChange(e) {
    this.props.onUnpaidItemsChange(e.target.checked);
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
    const itemsUnpaid = this.props.itemsUnpaid;

    return (
      <Form inline>
        <DatePicker
          todayButton="Oggi"
          locale="it"
          selected={filterDate}
          onChange={(date) => this.handleFilterDateChange(date)}
          customInput={<CustomInputDatePicker />}
        />
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0" check>
          <Label for="exampleCheck" check>Mostra prenotazioni da pagare</Label>
          <Input type="checkbox" name="check" id="exampleCheck" 
                 checked={itemsUnpaid} onChange={this.handleShowUnpaidChange} />
        </FormGroup>
        {/* <FormGroup className="mb-2 mx-sm-2 mb-sm-0" check>
          <Input type="checkbox" name="check" id="exampleCheck" 
                 checked={showAll} onChange={this.handleShowAllChange} />
          <Label for="exampleCheck" check>Mostra tutte</Label>
        </FormGroup> */}
      </Form>
    );
  }
}

export default ReservationsSearchBar;