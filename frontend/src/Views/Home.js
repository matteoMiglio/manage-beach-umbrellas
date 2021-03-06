import React, { Component } from "react";
import HomeRightPane from "../components/HomeRightPane";
import HomeCentralPane from "../components/HomeCentralPane";
import HomeSearchBar from "../components/HomeSearchBar";
import { Container, Row, Col } from 'reactstrap';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { GrFormAdd, GrView } from "react-icons/gr";
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";
import ReservationsModal from '../components/ReservationsModal';
import Notification from "../components/Notification";
import { FaPrint } from "react-icons/fa";
import ReactToPrint from 'react-to-print';
import axios from "axios";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

const mainButtonStyles = {
  backgroundColor: '#ab50e4',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
}

const actionButtonStyles = {
  backgroundColor: '#ab50e4'
}

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && 
      <div
        style={{
          width: "100%",
          height: "100",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Loader type="TailSpin" color="#774876" height={80} width={80}/>
      </div>
  );  
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testMatrix: [],
      freeBeachLoungers: null,
      reservedUmbrella: 0,
      filterDate: new Date(),
      showBeachLoungers: false,
      modal: false,
      myAlert: {show: false, title: "Notifica", text: "", backgroundColor: ""}
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {

    let tmp = this.state.filterDate.toISOString();
    const filterDate = tmp.substring(0, tmp.indexOf('T'));

    trackPromise(
      axios
        .get("/api/get-matrix/" + "?date=" + filterDate, {
          headers: {
              'Content-Type': 'application/json',
          }
        })
        .then((res) => {
          this.setState({ testMatrix: res.data })
          console.log(res.data)
        })
        .catch((err) => console.log(err))   
    );

    axios
      .get("/api/beach-loungers-count/" + "?date=" + filterDate, {
        headers: {
            'Content-Type': 'application/json',
        }
      })
      .then((res) => this.setState({ freeBeachLoungers: res.data }))
      .catch((err) => console.log(err));

    axios
      .get("/api/reserved-umbrella-count/" + "?date=" + filterDate, {
        headers: {
            'Content-Type': 'application/json',
        }
      })
      .then((res) => this.setState({ reservedUmbrella: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
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

  handleSubmit = (item, method) => {
    this.toggle();

    if (method.includes("save")) {

      if (item.umbrella === "" || item.umbrella === "-") {
        item.umbrella = null;
      }
  
      if (item.id) {
        axios
          .put(`/api/reservations/${item.id}/`, item)
          .then((res) => {
            this.refreshList();

            this.updateAlert("Modifica avvenuta con successo", "lightgreen")
            this.toggleAlert();
          })
          .catch((err) => {
            console.log(err)
            this.updateAlert("Modifica fallita", "lightcoral");
            this.toggleAlert();
          });
        return;
      }

      axios
        .post("/api/reservations/", item)
        .then((res) => {
          this.refreshList();

          this.updateAlert("Inserimento avvenuto con successo", "lightgreen");
          this.toggleAlert();
        })
        .catch((err) => {
          console.log(err)
          this.updateAlert("Inserimento fallito", "lightcoral");
          this.toggleAlert();
        });
    }

    if (method.includes("print")) {
      const obj = {
        type: "reservation",
        beachLoungers: item.beachLoungers,
        umbrella: item.umbrella
      }
  
      axios
        .post("/api/print-ticket/", obj)
        .then((res) => console.log(res.data));
    }
  };

  createItem = () => {
    let tmp = this.state.filterDate.toISOString();
    const newDate = tmp.substring(0, tmp.indexOf('T'));
    const item = { umbrella: "", 
                   customer: "",
                   beachLoungers: 1,
                   date: newDate, 
                   paid: false };

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Crea nuova prenotazione" 
    });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  handleFilterDateChange = (e) => {

    const date = new Date(e);

    this.setState({
      filterDate: date,
    });

    setTimeout(() => { this.refreshList() }, 50);
  };

  renderFloatingActionButton = () => {
    return (
      <Fab
        mainButtonStyles={mainButtonStyles}
        // actionButtonStyles={actionButtonStyles}
        icon={<GrFormAdd />}
        event="click"
        alwaysShowTitle={true}
      >
        <Action text="Prenota un ombrellone" 
                style={actionButtonStyles}
                onClick={() => this.createItem()}>            
          <UmbrellaLogo width={25} color="white" />
        </Action>
        <Action text="Prenota un lettino" 
                style={actionButtonStyles}
                onClick={() => this.createItem()}>            
          <BeachLoungerLogo width={25} color="white" />
        </Action>
        <Action text={this.state.showBeachLoungers ? "Nascondi lettini" : "Mostra lettini"}
                style={actionButtonStyles}
                onClick={() => this.setState({showBeachLoungers: !this.state.showBeachLoungers})}>  
          <GrView />   
        </Action>
        <Action text="Stampa piantina"
                style={actionButtonStyles}>
          <ReactToPrint
            trigger={() => {
              return <FaPrint />;
            }}
            documentTitle={"Planimetria_" + this.state.filterDate.toLocaleDateString()}
            onBeforeGetContent={() => this.setState({showBeachLoungers: true})}
            content={() => this.componentRef}
          />
        </Action>
      </Fab>
    );
  };

  render() {

    const reservedUmbrella = this.state.reservedUmbrella;
    const totalUmbrella = 128;

    return (
      <Container fluid className="pt-5">
        <Notification 
          // onToggle={this.toggleAlert}
          show={this.state.myAlert.show}
          title={this.state.myAlert.title}
          text={this.state.myAlert.text}
          backgroundColor={this.state.myAlert.backgroundColor}
        />
        <Row>
          <Col sm={12} md={4}>
            <HomeSearchBar filterDate={this.state.filterDate}
                           onFilterDateChange={this.handleFilterDateChange} />
          </Col>
          <Col sm={12} md={8}>
            <HomeRightPane totalUmbrella={totalUmbrella}
                           reservedUmbrella={reservedUmbrella}
                           freeBeachLoungers={this.state.freeBeachLoungers} />
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={12} className="px-0">
            <HomeCentralPane testMatrix={this.state.testMatrix}
                             showBeachLoungers={this.state.showBeachLoungers}
                             ref={el => (this.componentRef = el)} />
          </Col>
        </Row>
        <Row><LoadingIndicator/></Row>
        <Row className="mt-5"></Row>
        <Row className="mt-4"></Row>
        {this.renderFloatingActionButton()}
        {this.state.modal ? (
          <ReservationsModal
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

export default Home;