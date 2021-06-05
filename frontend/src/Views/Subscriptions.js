import React, { Component } from "react";
import SubscriptionsModal from "../components/SubscriptionsModal";
import SubscriptionsSearchBar from "../components/SubscriptionsSearchBar";
import SubscriptionsTable from "../components/SubscriptionsTable";
import { Button, Container, Row, Col } from 'reactstrap';
import axios from "axios";
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { GrFormAdd } from "react-icons/gr";

const mainButtonStyles = {
  backgroundColor: '#ab50e4',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
}

const actionButtonStyles = {
  backgroundColor: '#ab50e4'
}

const createEmptyItem = () => {
  const item = {
    code: null,
    umbrella: "",
    customer: "",
    beachLoungers: 1,
    startDate: "",
    endDate: "",
    type: "",
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

  handleSubmit = (item, method) => {
    this.toggle();

    if (method.includes("save")) {
      if (item.umbrella === "" || item.umbrella === "-") {
        item.umbrella = null;
      }

      if (item.type === "S") {
        item.startDate = "2021-05-15";
        item.endDate = "2021-09-30";
      }

      if (item.paid === "on")
        item.paid = true;

      if (item.id) {
        axios
          .put(`/api/subscriptions/${item.id}/`, item)
          .then((res) => {
            this.refreshList();

            if (method.includes("print")) {
              const obj = {
                type: "subscription",
                beachLoungers: item.beachLoungers,
                umbrella: item.umbrella,
                code: item.code,
                startDate: item.startDate,
                endDate: item.endDate
              }
          
              axios
                .post("/api/print-ticket/", obj)
                .then((res) => console.log(res.data));
            }
          });
        return;
      }

      axios
        .post("/api/subscriptions/", item)
        .then((res) => {
          this.refreshList();
          
          if (method.includes("print")) {
            const obj = {
              type: "subscription",
              beachLoungers: item.beachLoungers,
              umbrella: item.umbrella,
              code: res.data.code,
              startDate: item.startDate,
              endDate: item.endDate
            }
        
            axios
              .post("/api/print-ticket/", obj)
              .then((res) => console.log(res.data));
          }
        })
        .catch((err) => console.log(err));
    } else {
      if (method.includes("print")) {
        const obj = {
          type: "subscription",
          beachLoungers: item.beachLoungers,
          umbrella: item.umbrella,
          code: item.code,
          startDate: item.startDate,
          endDate: item.endDate
        }
    
        axios
          .post("/api/print-ticket/", obj)
          .then((res) => console.log(res.data));
      }
    }

    // console.log("item\n" + item.code)
    // console.log("tmp \n" + code)
    // return

    // if (method.includes("print")) {
    //   const obj = {
    //     type: "subscription",
    //     beachLoungers: item.beachLoungers,
    //     umbrella: item.umbrella,
    //     // code: item.code,
    //     startDate: item.startDate,
    //     endDate: item.endDate
    //   }
  
    //   axios
    //     .post("/api/print-ticket/", obj)
    //     .then((res) => console.log(res.data));
    // }
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

  deleteItem = (item) => {

    axios
      .delete(`/api/subscriptions/${item.id}/`)
      .then((res) => this.refreshList());
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

  renderFloatingActionButton = () => {
    return (
      <Fab
        mainButtonStyles={mainButtonStyles}
        // actionButtonStyles={actionButtonStyles}
        icon={<GrFormAdd />}
        event="click"
        onClick={() => this.createItem()}
        alwaysShowTitle={false}
      />
    );
  };

  render() {
    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Abbonamenti</h1>
        <Row>
          <Col sm={{ size: 11, offset: 1}} className='mb-3'>
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
                                onDeleteButtonClick={this.deleteItem} />
          </Col>
        </Row>
        {this.renderFloatingActionButton()}
        {this.state.modal ? (
          <SubscriptionsModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={(item, method) => this.handleSubmit(item, method)}
            modal_title={this.state.modal_title}
          />
        ) : null}
      </Container>
    );
  }
}

export default Subscriptions;