import React from "react";
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import MyTable from "./Table";

class ReservationsTable extends React.Component {

  constructor(props) {
    super(props);
    this.handleEditItem = this.handleEditItem.bind(
      this
    );
  }

  handleEditItem(e) {
    this.props.onEditButtonClick(e.original);
  }

  render() {

    const { totalItems, searchText, itemsUnpaid, showSunbeds, showUmbrellas, showNoSubscription } = this.props;

    // console.log(totalItems)

    const columns = [
      {
        Header: 'Ombrellone',
        accessor: 'umbrella.code',
        Cell: (row) => {
          return <span style={{fontWeight: 'bold'}}>{row.row.original.umbrella ? "#" + row.row.original.umbrella.code : "-"}</span>;
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
        Header: 'Data',
        accessor: 'date',
        Cell: (row) => {
          return row.row.original.date
        }
      },
      {
        Header: 'Oggetto',
        accessor: 'endDate',
        Cell: (row) => {
          return row.row.original.umbrella ? <UmbrellaLogo width={25} color="black" /> : <BeachLoungerLogo width={25} color="black" />
        }
      },
      {
        Header: 'Abbonamento',
        accessor: 'subscription',
        Cell: (row) => {
          return row.row.original.subscription ? <FaCheckCircle /> : <FaTimesCircle />
        }
      },
    ]

    const filteredItems = [];

    totalItems.forEach((item) => {

      let founded = false

      if (item.customer.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
        founded = true
      }

      if (item.umbrella && item.umbrella.code.indexOf(searchText.toUpperCase()) != -1) {
        founded = true
      }

      if (!founded)
        return;

      if ((item.paid == null) || (itemsUnpaid && item.paid)) {
        return;
      }

      if (showNoSubscription) {
        if (item.subscription != null)
          return;
      }

      if (showUmbrellas) {
        if (item.umbrella == null)
        return;
      }

      if (showSunbeds) {
        if (item.umbrella != null)
        return;
      }

      filteredItems.push(item);
    });

    return (
      <MyTable data={filteredItems} columns={columns} handleEditItem={(e) => this.handleEditItem(e)} />
    );
  }
}

export default ReservationsTable;