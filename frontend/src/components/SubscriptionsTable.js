import React, { Component } from "react";
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";
import MyTable from "./Table";
import { isLastDayOfMonth, isFirstDayOfMonth } from "date-fns";

const dayNames = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
const monthNames = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

class SubscriptionsTable extends Component {

  constructor(props) {
    super(props);
  }

  handleEditItem = (e) => {
    this.props.onEditButtonClick(e.original);
  }
  
  handleDeleteItem = (e) => {
    this.props.onDeleteButtonClick(e);
  }



  render() {

    const { searchText, itemsUnpaid, showSunbeds, showUmbrellas, showSeasonalSubscriptions, totalItems } = this.props;

    // console.log(totalItems)

    const columns = [
      {
        Header: '#',
        accessor: 'id',
        Cell: (row) => {
          return <span style={{fontWeight: 'bold'}}>{row.row.original.code}</span>;
        }
      },
      {
        Header: 'Ombrellone',
        accessor: 'umbrella.code',
        Cell: (row) => {
          return row.row.original.umbrella ? "#" + row.row.original.umbrella.code : "-";
        }
      },
      {
        Header: 'Lettini',
        accessor: 'sunbeds',
      },
      {
        Header: 'Intestatario',
        accessor: 'customer',
      },
      {
        Header: 'Stato',
        accessor: 'paid',
        Cell: (row) => {
          const state = row.row.original.paid ? (
            <span style={{color: 'blue'}}>Pagato</span>
          ) : (
            <span style={{color: 'red'}}>Da pagare</span>
          );
          return state;
        }
      },
      {
        Header: 'Totale',
        accessor: 'total',
        Cell: (row) => {
          return row.row.original.total ? row.row.original.total+"€" : "0€";
        }
      },
      {
        Header: 'Acconto',
        accessor: 'deposit',
        Cell: (row) => {
          return row.row.original.paid ? (
            <span style={{color: '#ccc'}}>{row.row.original.deposit ? row.row.original.deposit : "0"}€</span>
          ) : (
            row.row.original.deposit ? row.row.original.deposit+"€" : "0€"
          );
        }
      },
      {
        Header: 'Tipo',
        accessor: 'type',
        Cell: (row) => {
          let type = "";
          switch (row.row.original.type) {
            case "S": 
              type = "Stagionale";
              break;
            case "P":
              type = "Periodo";
              break;
            case "C":
              type = "Personalizzato";
              break;
            default:
              type = "-";
          }
          return type;
        }
      },
      {
        Header: 'Validità',
        accessor: 'start_date',
        Cell: (row) => {
          let validity = "";
          switch (row.row.original.type) {
            case "S": 
              validity = "-";
              break;
            case "P":

              let sd = new Date(row.row.original.start_date);
              let startDateMonth = sd.getMonth() + 1;
              let ed = new Date(row.row.original.end_date);
              let endDateMonth = ed.getMonth() + 1;         

              if (isFirstDayOfMonth(sd) && isLastDayOfMonth(ed)) {
                let diff = endDateMonth - startDateMonth;
                let tmp_months = [...Array(diff + 1).keys()].map(i => monthNames[i + startDateMonth]);
                validity = tmp_months.join(', ');
              } else {
                validity = row.row.original.start_date + " -> " + row.row.original.end_date;
              }

              break;
            case "C":
              var days = row.row.original.custom_period.split("-")[0].split(",");
              var months = row.row.original.custom_period.split("-")[1].split(",");
      
              var midweek = ['0', '1', '2', '3', '4']
              var weekend = ['5', '6']
              if (days.length === midweek.length && days.every(function(value, index) { return value === midweek[index]})) {
                validity += "Infrasettimanale "
              } else if (days.length === weekend.length && days.every(function(value, index) { return value === weekend[index]})) {
                validity += "Weekend "
              } else {
                for (var i=0; i<days.length; i++) {
                  validity += dayNames[days[i]]
                  if (i != (days.length - 1)) 
                    validity += ", "
                }
              }
      
              if (months.length > 1)
                validity += " nei mesi di "
              else
                validity += " nel mese di "
      
              for(i=0; i<months.length; i++) {
                validity += monthNames[months[i]]
                if (i != (months.length - 1)) 
                  validity += ", "
              }
      
              break;
            default:
              validity = "-";
          }
          return validity;
        }
      },
      {
        Header: 'Oggetto',
        accessor: 'end_date',
        Cell: (row) => {
          return row.row.original.umbrella ? <UmbrellaLogo width={25} color="black" /> : <BeachLoungerLogo width={25} color="black" />
        }
      },
    ]

    const filteredItems = [];

    totalItems.forEach((item) => {

      let founded = false

      if (item.customer.toLowerCase().indexOf(searchText.toLowerCase()) != -1)
        founded = true

      if (item.umbrella && item.umbrella.code.indexOf(searchText.toUpperCase()) != -1)
        founded = true

      if (item.code.toString().indexOf(searchText.toLowerCase()) != -1)
        founded = true

      if (!founded)
        return;

      if ((item.paid == null) || (itemsUnpaid && item.paid))
        return;

      if (showUmbrellas && item.umbrella == null) 
        return;

      if (showSunbeds && item.umbrella != null)
        return;

      if (showSeasonalSubscriptions && item.type != "S")
        return;

      filteredItems.push(item);
    });

    return (
      <MyTable data={filteredItems} columns={columns} handleEditItem={(e) => this.handleEditItem(e)} />
    );
  }
}

export default SubscriptionsTable;