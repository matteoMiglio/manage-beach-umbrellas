import React, { Component } from "react";
import 'react-tiny-fab/dist/styles.css';
import Notification from "../components/Notification";
import axios from "axios";
import { Container } from "reactstrap";
import SettingsFirstForm from '../components/SettingsFirstForm';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      myAlert: {show: false, title: "Notifica", text: "", backgroundColor: ""},
      isLoading: true
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {

    axios
      .get("/api/constants/")
      .then((res) => {
        this.setState({ itemList: res.data });
      })
      .catch((err) => console.log(err))
      .finally(() => (this.setState({ isLoading: false })))
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

  handleSubmit = (item) => {
    this.toggle();

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
  };

  render() {

    if (this.state.isLoading) return null;

    console.log(this.state.itemList);

    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Impostazioni</h1>
        <Notification 
          // onToggle={this.toggleAlert}
          show={this.state.myAlert.show}
          title={this.state.myAlert.title}
          text={this.state.myAlert.text}
          backgroundColor={this.state.myAlert.backgroundColor}
        />
        <SettingsFirstForm 
          activeItem={this.state.activeItem}
          toggle={this.toggle}
          onSave={(item) => this.handleSubmit(item)}      
        />   
      </Container>
    );
  }
}

export default Settings;