import React, { Component } from "react";
import SubscriptionsModal from "../components/SubscriptionsModal";
import SubscriptionsSearchBar from "../components/SubscriptionsSearchBar";
import SubscriptionsTable from "../components/SubscriptionsTable";
import Notification from "../components/Notification";
import { Container, Row, Col } from 'reactstrap';
import axios from "axios";
import { Fab } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { GrFormAdd } from "react-icons/gr";

const mainButtonStyles = {
  backgroundColor: '#ab50e4',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
}

const createEmptyItem = () => {
  const item = {
    umbrella: "",
    customer: "",
    sunbeds: 1,
    start_date: null,
    end_date: null,
    type: "",
    paid: false,
    deposit: null,
    total: null,
    customDays: [],
    customMonths: [],
    // freePeriodList: []
  }

  return item;
}

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      currentItems: [],
      searchText: '',
      itemsUnpaid: false,
      showUmbrellas: false,
      showSunbeds: false,
      modal: false, 
      myAlert: {show: false, title: "Notifica", text: "", backgroundColor: ""},
      currentPage: 1, 
      totalPages: null,
      pageLimit: 10,
      isLoading: true,
      activeItem: createEmptyItem(),
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    
    axios
      .get("/api/subscriptions/")
      .then((res) => {
        this.setState({ itemList: res.data })
      })
      .catch((err) => console.log(err))
      .finally(() => (this.setState({ isLoading: false })))
  };

  handleSubmit = (item, method) => {
    this.toggle();

    if (method.includes("save")) {
      if (item.umbrella === "" || item.umbrella === "-") {
        item.umbrella = null;
      }

      if (item.total === "") {
        item.total = null
      }

      if (item.deposit === "") {
        item.deposit = null
      }

      if (item.type === "S") {
        item.start_date = "2023-05-1";
        item.end_date = "2023-09-30";
      }

      if (item.paid === "on")
        item.paid = true;

      // se esiste l'ID vuol dire che l'abbonamento esiste già e faccio un update
      if (item.id) {
        axios
          .put(`/api/subscriptions/${item.id}/`, item)
          .then((res) => {
            this.refreshList();

            this.updateAlert("Modifica avvenuta con successo", "lightgreen")
            this.toggleAlert();

            if (method.includes("print")) {
              const obj = {
                type: "subscription",
                sunbeds: item.sunbeds,
                umbrella: item.umbrella,
                id: item.id,
                start_date: item.start_date,
                end_date: item.end_date,
                subscription_type: item.type,
                custom_period: item.custom_period                
              }

              axios
                .post("/api/printer/ticket/", obj)
                .then((res) => console.log(res.data));
            }
          })
          .catch((err) => {
            console.log(err)
            this.updateAlert("Modifica fallita", "lightcoral");
            this.toggleAlert();
          });
        return;
      }

      axios
        .post("/api/subscriptions/", item)
        .then((res) => {
          this.refreshList();
          
          this.updateAlert("Inserimento avvenuto con successo", "lightgreen");
          this.toggleAlert();

          if (method.includes("print")) {
            const obj = {
              type: "subscription",
              sunbeds: item.sunbeds,
              umbrella: item.umbrella,
              id: res.data.id,
              start_date: item.start_date,
              end_date: item.end_date,
              subscription_type: item.type,
              custom_period: item.custom_period              
            }
        
            axios
              .post("/api/printer/ticket/", obj)
              .then((res) => console.log(res.data));
          }
        })
        .catch((err) => {
          console.log(err)
          this.updateAlert("Inserimento fallito", "lightcoral");
          this.toggleAlert();
        });

    } else {
      if (method.includes("print")) {

        const obj = {
          type: "subscription",
          sunbeds: item.sunbeds,
          umbrella: item.umbrella,
          id: item.id,
          start_date: item.start_date,
          end_date: item.end_date,
          subscription_type: item.type,
          custom_period: item.custom_period
        }
  
        axios
          .post("/api/printer/ticket/", obj)
          .then((res) => console.log(res.data));
      }
    }
  };

  createItem = () => {
    const item = createEmptyItem();

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modalTitle: "Crea nuovo abbonamento" 
    });
  };

  editItem = (item) => {

    const customDays = item.custom_period ? item.custom_period.split("-")[0].split(",") : null;
    const customMonths = item.custom_period ? item.custom_period.split("-")[1].split(",") : null;

    item['customDays'] = customDays;
    item['customMonths'] = customMonths;

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modalTitle: "Modifica abbonamento" 
    });
  };

  deleteItem = (item) => {

    this.toggle();

    axios
      .delete(`/api/subscriptions/${item.id}/`)
      .then((res) => {
        this.updateAlert("Eliminazione avvenuta con successo", "lightgreen")
        this.toggleAlert();

        this.refreshList();
      })
      .catch((err) => {
        console.log(err);
        this.updateAlert("Eliminazione fallita", "lightcoral")
        this.toggleAlert();
      });
  };

  toggle = () => {
    this.setState({ 
      modal: !this.state.modal 
    });
  };

  updateAlert = (text, color) => {
    var myAlert = {...this.state.myAlert};
    myAlert.text = text;
    myAlert.backgroundColor = color;
    
    this.setState({ myAlert })
  }

  toggleAlert = () => {
    let myAlert = {...this.state.myAlert};
    myAlert.show = !myAlert.show;

    // this.setState({ myAlert });

    this.setState({ myAlert }, () => {
      window.setTimeout(() => {
        let myAlert = {...this.state.myAlert};
        myAlert.show = !myAlert.show;
        this.setState({ myAlert })
      }, 4000)
    });
  };

  handleFilterTextChange = (text) => {
    this.setState({
      searchText: text,
    });
  }

  handleShowUnpaidChange = (paid) => {
    this.setState({
      itemsUnpaid: paid,
    });
  }

  handleShowUmbrellaChange = (el) => {

    this.setState({
      showUmbrellas: el,
    });
  }

  handleShowSunbedsChange = (el) => {

    this.setState({
      showSunbeds: el,
    });
  }

  renderFloatingActionButton = () => {
    return (
      <Fab
        mainButtonStyles={mainButtonStyles}
        icon={<GrFormAdd />}
        event="click"
        onClick={() => this.createItem()}
        alwaysShowTitle={false}
      />
    );
  };

  render() {

    if (this.state.isLoading) return null;

    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Abbonamenti</h1>
        <Notification 
          // onToggle={this.toggleAlert}
          show={this.state.myAlert.show}
          title={this.state.myAlert.title}
          text={this.state.myAlert.text}
          backgroundColor={this.state.myAlert.backgroundColor}
        />
        <Row>
          <Col sm={{ size: 11, offset: 1}} className='mb-3'>
            <SubscriptionsSearchBar onFilterTextChange={this.handleFilterTextChange}
                                    onUnpaidItemsChange={this.handleShowUnpaidChange} 
                                    onShowUmbrellasChange={this.handleShowUmbrellaChange} 
                                    onShowSunbedsChange={this.handleShowSunbedsChange} 
                                    itemsPaid={this.state.itemsPaid}
                                    searchText={this.state.searchText}
                                    showSunbeds={this.state.showSunbeds}
                                    showUmbrellas={this.state.showUmbrellas} />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="px-4">
            <SubscriptionsTable totalItems={this.state.itemList}
                                itemsUnpaid={this.state.itemsUnpaid}
                                searchText={this.state.searchText} 
                                showSunbeds={this.state.showSunbeds}
                                showUmbrellas={this.state.showUmbrellas} 
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
            onDelete={this.deleteItem}
            modalTitle={this.state.modalTitle}
          />
        ) : null}
      </Container>
    );
  }
}

export default Subscriptions;