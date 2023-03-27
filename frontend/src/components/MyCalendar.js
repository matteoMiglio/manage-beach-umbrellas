import React, { Component } from "react";
import { Table } from 'reactstrap';

class MyCalendar extends Component {
  
    renderSingleRow = (items, data) => {

      const row = [];
  
      if (items.length < 7)
        items = items.concat(Array(7-items.length).fill(0));
  
      items.slice(0, items.length).forEach((item, index) => {
  
        var color = "#c3f5c3";
        var text = "";

        data.forEach((reservation, index) => {
          const date = new Date(reservation.date);
          if (date.getDate() === item && reservation.paid != null) {
            color = "#fdaeae";
            text = reservation.customer
          }
        })

        row.push( 
          <td key={index} style={ item === 0 ? {} : { backgroundColor: color }}>
            <span style={{ fontWeight: 'bold' }}>{item === 0 ? "" : item}</span>
            <br />
            {text}
          </td>
        );
      });
  
      return row;
    }
  
    render() {
  
      const matrix = [];
      const calendar = [];
      const { currentMonth, data, days } = this.props;
      const currentYear = new Date().getFullYear();
      const d = new Date(currentYear, currentMonth.getMonth(), 1);

      var dayOfWeek = d.getDay();

      if (dayOfWeek === 0) // se è uguale a 0, vuol dire che è Domenica
        dayOfWeek = 7;

      const startArray = Array(dayOfWeek-1).fill(0)

      matrix.push(startArray.concat(days.splice(0, 7-dayOfWeek+1)))

      while (days.length > 0)
        matrix.push(days.splice(0, 7));
  
      matrix.slice(0, matrix.length).map((row, index) => {
        return calendar.push(
          <tr key={index} style={{ height: 90 }}>
            {this.renderSingleRow(row, data)}
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

export default MyCalendar;