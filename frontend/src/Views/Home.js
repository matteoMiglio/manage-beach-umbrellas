import React, { Component } from "react";
import HomeRightPane from "../components/HomeRightPane";
import HomeCentralPane from "../components/HomeCentralPane";
import HomeSearchBar from "../components/HomeSearchBar";
import { Container, Row, Col } from 'reactstrap';
import faker from 'faker';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { GrFormAdd } from "react-icons/gr";
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";
import ReservationsModal from '../components/ReservationsModal';

const mainButtonStyles = {
  backgroundColor: '#ab50e4',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
}

const actionButtonStyles = {
  backgroundColor: '#ab50e4'
}

function fakerUmbrellas() {
  var i = 0;

  const createUmbrella = () => {
    i++;
    return {
      id: i,
      paid: faker.datatype.boolean() ? null : faker.datatype.boolean(),
      beachLoungers: faker.datatype.number(3) + 1
    }
  }
  
  const createUmbrellas = (numUmbrella = 5) => {
    return new Array(numUmbrella)
      .fill(undefined)
      .map(createUmbrella);
  }
  
  return createUmbrellas(120);
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      umbrellaList: fakerUmbrellas(),
      splitRow: 14,
      freeBeachLoungers: faker.finance.creditCardCVV(),
      filterDate: new Date(),
      showBeachLounger: false,
      modal: false,
      activeItem: {
        id: 0,
        position: "",
        beach_loungers: "",
        paid: null
      },
    };
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    const updateItem = item;

    alert("save: " + JSON.stringify(item));
  };

  createItem = () => {
    const item = { id: "", 
                   position: "", 
                   customerName: "",
                   beach_loungers: 1,
                   date: new Date(this.state.filterDate), 
                   paid: false };

    this.setState({ 
      activeItem: item, 
      modal: !this.state.modal, 
      modal_title: "Crea nuova prenotazione" 
    });
  };

  handleFilterDateChange = (e) => {

    const date = new Date(e);
    const umbrellaList = fakerUmbrellas();

    this.setState({
      filterDate: date,
      umbrellaList: umbrellaList
    });
  }

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  render() {
    let i = 0;
    this.state.umbrellaList.forEach((item) => 
      item.paid != null ? i++ : null
    );
    const reservedUmbrella = i;

    return (
      <Container fluid className="pt-5">
        <Row>
          <Col sm={12} md={4}>
            <HomeSearchBar filterDate={this.state.filterDate}
                           onFilterDateChange={this.handleFilterDateChange} />
          </Col>
          <Col sm={12} md={8}>
            <HomeRightPane totalUmbrella={this.state.umbrellaList.length}
                           reservedUmbrella={reservedUmbrella}
                           freeBeachLoungers={this.state.freeBeachLoungers} />
          </Col>
            {/* <h1 className="text-black text-left my-4">30 Aprile 2021</h1> */}
        </Row>
        <Row>
          <Col md={12} sm={12} className="px-0">
            <HomeCentralPane umbrellaList={this.state.umbrellaList}
                             splitRow={this.state.splitRow}
                             showBeachLounger={this.state.showBeachLounger} />
          </Col>
          {/* <Col md={2} sm={12}>
            <HomeRightPane totalUmbrella={this.state.umbrellaList.length}
                           reservedUmbrella={reservedUmbrella}
                           freeBeachLoungers={this.state.freeBeachLoungers} />
          </Col> */}
        </Row>
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
                  onClick={() => alert('Prenota un lettino')}>            
            <BeachLoungerLogo width={25} color="white" />
          </Action>
          <Action text={this.state.showBeachLounger ? "Nascondi lettini" : "Mostra lettini"}
                  style={actionButtonStyles}
                  onClick={() => this.setState({showBeachLounger: !this.state.showBeachLounger})}>            
            <BeachLoungerLogo width={25} color="white" />
          </Action>
        </Fab>
        {this.state.modal ? (
          <ReservationsModal
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

export default Home;