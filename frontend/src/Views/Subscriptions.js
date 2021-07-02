import React, { Component } from "react";
import SubscriptionsModal from "../components/SubscriptionsModal";
import SubscriptionsSearchBar from "../components/SubscriptionsSearchBar";
import SubscriptionsTable from "../components/SubscriptionsTable";
import Notification from "../components/Notification";
import { Button, Container, Row, Col } from 'reactstrap';
import axios from "axios";
import { Fab } from 'react-tiny-fab';
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
    startDate: null,
    endDate: null,
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
      showBeachLoungers: false,
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

  onPageChanged = data => {
    const { currentPage, totalPages, pageLimit } = data;
  
    axios
      .get(`/api/subscriptions?page=${currentPage}&limit=${pageLimit}`)
      .then(response => {
        const currentItems = response.data;
        this.setState({ currentPage, currentItems, totalPages });
      });
  }

  refreshList = () => {
    
    axios
      .get("/api/subscriptions/")
      .then((res) => {
        this.setState({ itemList: res.data })
        axios
          .get(`/api/subscriptions?page=${this.state.currentPage}&limit=${this.state.pageLimit}`)
          .then(response => {
            const currentItems = response.data;
            this.setState({ currentItems });
          });
      })
      .catch((err) => console.log(err))
      .finally(() => (this.setState({ isLoading: false })))
  };

  handleSubmit = (item, method) => {
    this.toggle();

    item['customPeriod'] = item.customDays.join(",") + "-" + item.customMonths.join(",");

    if (method.includes("save")) {
      if (item.umbrella === "" || item.umbrella === "-") {
        item.umbrella = null;
      }

      if (item.type === "S") {
        item.startDate = "2021-05-1";
        item.endDate = "2021-09-30";
      }

      if (item.paid === "on")
        item.paid = true;

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
        .catch((err) => {
          console.log(err)
          this.updateAlert("Inserimento fallito", "lightcoral");
          this.toggleAlert();
        });

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

    const customDays = item.custom_period ? item.custom_period.split("-")[0].split(",") : null;
    const customMonths = item.custom_period ? item.custom_period.split("-")[1].split(",") : null;

    item['customDays'] = customDays;
    item['customMonths'] = customMonths;

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Modifica abbonamento" 
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

  handleShowBeachLoungersChange = (el) => {

    this.setState({
      showBeachLoungers: el,
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

    const columns = [
      {
        Header: '#',
        accessor: 'code',
      },
      {
        Header: 'Ombrellone',
        accessor: 'umbrella.code',
      },
      {
        Header: 'Intestatario',
        accessor: 'customer',
      },
      {
        Header: 'Lettini',
        accessor: 'beachLoungers',
      },
      {
        Header: 'Stato',
        accessor: 'paid',
      },
      {
        Header: 'Totale',
        accessor: 'total',
      },
      {
        Header: 'Acconto',
        accessor: 'deposit',
      },
      {
        Header: 'Tipo',
        accessor: 'type',
      },
      {
        Header: 'Validità',
        accessor: 'startDate',
      },
      // {
      //   Header: 'Oggetto',
      //   accessor: 'col2',
      // },
      // {
      //   Header: 'Action',
      //   accessor: 'col2',
      // },
    ]


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
                                    onShowBeachLoungersChange={this.handleShowBeachLoungersChange} 
                                    itemsPaid={this.state.itemsPaid}
                                    searchText={this.state.searchText}
                                    showBeachLoungers={this.state.showBeachLoungers}
                                    showUmbrellas={this.state.showUmbrellas} />
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={6} className="mx-auto px-4">
            <SubscriptionsTable items={this.state.currentItems}
                                totalItems={this.state.itemList}
                                itemsUnpaid={this.state.itemsUnpaid}
                                searchText={this.state.searchText} 
                                showBeachLoungers={this.state.showBeachLoungers}
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
            onDelete={this.deleteItem}
            onSave={(item, method) => this.handleSubmit(item, method)}
            modal_title={this.state.modal_title}
          />
        ) : null}
      </Container>
    );
  }
}

export default Subscriptions;