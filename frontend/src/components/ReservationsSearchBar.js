import React, { Component, ForwardedRef } from "react";
import { Form, Button, Label, Input, FormGroup, CustomInput } from 'reactstrap';
import DatePicker, { registerLocale, setDefaultLocale, getDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import it from 'date-fns/locale/it';
registerLocale('it', it);

class ReservationsSearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(
      this
    );
    this.handleFilterDateChange = this.handleFilterDateChange.bind(
        this
    );
    this.handleShowUnpaidChange = this.handleShowUnpaidChange.bind(
      this
    );
    this.handleShowUnpaidChange = this.handleShowUnpaidChange.bind(
      this
    );
    this.handleShowUmbrellasChange = this.handleShowUmbrellasChange.bind(
      this
    );
    this.handleShowBeachLoungersChange = this.handleShowBeachLoungersChange.bind(
      this
    );
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  handleFilterDateChange(date) {
    this.props.onFilterDateChange(date);
  }

  handleShowUnpaidChange(e) {
    this.props.onUnpaidItemsChange(e.target.checked);
  }

  handleShowUmbrellasChange(e) {
    this.props.onShowUmbrellasChange(e.target.checked);
  }

  handleShowBeachLoungersChange(e) {
    this.props.onShowBeachLoungersChange(e.target.checked);
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
    const searchText = this.props.searchText;
    const itemsUnpaid = this.props.itemsUnpaid;
    const showBeachLoungers = this.props.showBeachLoungers;
    const showUmbrellas = this.props.showUmbrellas;

    return (
      <Form inline>
        <DatePicker
          todayButton="Oggi"
          dateFormat="dd/MM/yyyy"
          locale="it"
          selected={filterDate}
          onChange={(date) => this.handleFilterDateChange(date)}
          customInput={<CustomInputDatePicker />}
        />
        <FormGroup className="mx-2 mr-sm-2 mb-sm-0">
          <Input type="text" name="searchText" id="searchText" placeholder="Ricerca cliente"
                 value={searchText} onChange={this.handleFilterTextChange} />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <CustomInput type="switch" id="showUnpaidReservation" name="showUnpaidReservation" checked={itemsUnpaid}
                       onChange={this.handleShowUnpaidChange} label="Mostra prenotazioni da pagare" />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <CustomInput type="switch" id="showUmbrella" name="showUmbrella" checked={showUmbrellas}
                       onChange={this.handleShowUmbrellasChange} label="Mostra solo ombrelloni" />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <CustomInput type="switch" id="showBeachLoungers" name="showBeachLoungers" checked={showBeachLoungers}
                       onChange={this.handleShowBeachLoungersChange} label="Mostra solo lettini" />
        </FormGroup>
      </Form>
    );
  }
}

export default ReservationsSearchBar;