import React from "react";
import { Button } from 'reactstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import it from 'date-fns/locale/it';
registerLocale('it', it);

const months = {
  0: "Gennaio",
  1: "Febbraio",
  2: "Marzo",
  3: "Aprile",
  4: "Maggio",
  5: "Giugno",
  6: "Luglio",
  7: "Agosto",
  8: "Settembre",
  9: "Ottobre",
  10: "Novembre",
  11: "Dicembre"
};

class HomeSearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.handleFilterDateChange = this.handleFilterDateChange.bind(
        this
    );
  }

  handleFilterDateChange(date) {
    this.props.onFilterDateChange(date);
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

  getLongDateString = (date) => {

    const _date = new Date(date);
    const year = _date.getFullYear();
    const day = _date.getDate();
    const monthIndex = _date.getMonth();
    const monthName = months[monthIndex];

    return day + " " + monthName + " " + year;
  }

  render() {
    const filterDate = this.props.filterDate;

    const CustomInputDatePicker = React.forwardRef(
      ({ value, onClick }, ref) => (
        <Button size="lg" color="white" onClick={onClick} ref={ref}>
          <h1 className="text-black text-left m-0">
            {this.getLongDateString(value)}
          </h1>
        </Button>
      )
    );

    return (
      <div className="mt-4">   
        <DatePicker 
          todayButton="Oggi"
          locale="it"
          calendarStartDay={1}
          selected={filterDate}
          onChange={(date) => this.handleFilterDateChange(date)}
          customInput={<CustomInputDatePicker />}
        />
      </div>
    );
  }
}

export default HomeSearchBar;