import React, { Component } from "react";
import SubscriptionsModal from "../components/SubscriptionsModal";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import { Button, Container, Row, Col } from 'reactstrap';

const items = [
  {
    id: 1001,
    position: "A1",
    customerName: "Luca",
    beach_loungers: "1",
    startDate: "29-04-2021",
    endDate: "29-09-2021",
    paid: true,
    freePeriodList: []
  },
  {
    id: 1002,
    position: "A2",
    customerName: "Matteo",
    beach_loungers: "2",
    startDate: "29-04-2021",
    endDate: "29-09-2021",
    paid: true,
    freePeriodList: []
  },
  {
    id: 1003,
    position: "B1",
    customerName: "Luigi",
    beach_loungers: "3",
    startDate: "29-04-2021",
    endDate: "29-09-2021",
    paid: false,
    freePeriodList: []
  },
  {
    id: 1004,
    position: "B2",
    customerName: "Gianni",
    beach_loungers: "3",
    startDate: "29-04-2021",
    endDate: "29-09-2021",
    paid: false,
    freePeriodList: [{value: "ciao"}]
  },
  {
    id: 1005,
    position: "-",
    customerName: "Gianni",
    beach_loungers: "2",
    startDate: "29-07-2021",
    endDate: "29-09-2021",
    paid: true,
    freePeriodList: [{value: "ultimo"}]
  }
];

const createEmptyItem = () => {
  const item = {
    id: 0,
    position: "",
    customerName: "",
    dateRange: [null, null],
    // startDate: "",
    // endDate: "",
    freePeriodList: []
  }

  return item;
}

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: items,
      searchText: '',
      itemsPaid: false,
      modal: false,
      activeItem: createEmptyItem(),
    };
  }

  toggle = () => {
    this.setState({ 
      modal: !this.state.modal 
    });
  };

  handleSubmit = (item) => {
    this.toggle();

    alert("save" + JSON.stringify(item));
  };

  createItem = () => {
    const item = createEmptyItem();

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Crea nuovo abbonamento" 
    });
  };

  handleEditButtonClick = (item) => {
    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Modifica abbonamento" 
    });
  };

  handleDeleteButtonClick = (item) => {
    alert("delete" + JSON.stringify(item));
  };

  handleFilterTextChange = (text) => {
    this.setState({
      searchText: text,
    });
  }

  handleShowPaidChange = (paid) => {
    this.setState({
      itemsPaid: paid,
    });
  }

  render() {
    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Abbonamenti</h1>
        <Row>
          <Col sm={{ size: 2, offset: 1 }} className='mb-3'>
            <Button color="primary" onClick={this.createItem}>Crea nuovo</Button>
          </Col>
          <Col sm={9}>
            <SearchBar onFilterTextChange={this.handleFilterTextChange}
                       onPaidItemsChange={this.handleShowPaidChange} 
                       itemsPaid={this.state.itemsPaid}
                       searchText={this.state.searchText} />
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={6} className="mx-auto p-0">
            <DataTable items={this.state.itemList}
                       itemsPaid={this.state.itemsPaid}
                       searchText={this.state.searchText} 
                       onEditButtonClick={this.handleEditButtonClick} 
                       onDeleteButtonClick={this.handleDeleteButtonClick} />
          </Col>
        </Row>
        {this.state.modal ? (
          <SubscriptionsModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
            modal_title={this.state.modal_title}
          />
        ) : null}
      </Container>
    );
  }
}

export default Subscriptions;