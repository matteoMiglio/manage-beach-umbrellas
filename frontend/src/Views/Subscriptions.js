import React, { Component } from "react";
import SubscriptionsModal from "../components/SubscriptionsModal";
import SubscriptionsSearchBar from "../components/SubscriptionsSearchBar";
import SubscriptionsTable from "../components/SubscriptionsTable";
import { Button, Container, Row, Col } from 'reactstrap';
import axios from "axios";

const createEmptyItem = () => {
  const item = {
    code: null,
    umbrella: "",
    customer: "",
    beachLoungers: 1,
    startDate: "",
    endDate: "",
    subscriptionType: "",
    paid: false,
    // freePeriodList: [],
    // customDays: [],
    // customMonths: []
  }

  return item;
}

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      searchText: '',
      itemsPaid: false,
      modal: false,
      activeItem: createEmptyItem(),
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/subscriptions/")
      .then((res) => this.setState({ itemList: res.data }))
      .catch((err) => console.log(err));
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.subscriptionType === "S") {
      item.startDate = "2021-05-15";
      item.endDate = "2021-09-15";
    }

    if (item.paid === "on")
      item.paid = true;

    if (item.id) {
      axios
        .put(`/api/subscriptions/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }

    axios
      .post("/api/subscriptions/", item)
      .then((res) => this.refreshList());
  };

  handleDeleteButtonClick = (item) => {
    axios
      .delete(`/api/subscriptions/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = createEmptyItem();

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Crea nuovo abbonamento" 
    });
  };

  editItem = (item) => {
    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Modifica abbonamento" 
    });
  };

  toggle = () => {
    this.setState({ 
      modal: !this.state.modal 
    });
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
            <SubscriptionsSearchBar onFilterTextChange={this.handleFilterTextChange}
                                    onPaidItemsChange={this.handleShowPaidChange} 
                                    itemsPaid={this.state.itemsPaid}
                                    searchText={this.state.searchText} />
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={6} className="mx-auto p-0">
            <SubscriptionsTable items={this.state.itemList}
                                itemsPaid={this.state.itemsPaid}
                                searchText={this.state.searchText} 
                                onEditButtonClick={this.editItem} 
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