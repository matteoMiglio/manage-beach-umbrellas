import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Col,
  CustomInput
} from "reactstrap";
import axios from "axios";

export default class ReservationsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      umbrellaList: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
  
    const date = this.state.activeItem.date;

    axios
      .get("/api/free-umbrella-reservation/?date=" + date, {
        headers: {
            'Content-Type': 'application/json',
        }
      })
      .then((res) => (this.setState({ umbrellaList: res.data })))
      .catch((err) => console.log(err));
  };

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    if (e.target.type === "select-multiple") {
      value = Array.from(e.target.selectedOptions, option => option.value);
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    console.log("Item updated: ");
    console.log(activeItem);
    this.setState({ activeItem });

    if (name == "date"){
      this.refreshList();
    }
  };

  renderUmbrellaSelection = () => {

    const list = this.state.umbrellaList;

    return list.map((item, index) => (
      <option key={index} selected={this.state.activeItem.umbrella ? item.code == this.state.activeItem.umbrella.code : null}>
        {item.code}
      </option>
    ));
  }

  renderSunbedsSelection = () => {

    const sunbedsList = [1,2,3,4,5] // max numero di lettini concessi per ombrellone

    return sunbedsList.map((item) => (
      <option key={item} selected={item == this.state.activeItem.sunbeds}>
        {item}
      </option>
    ));
  }

  render() {
    const { toggle, onSave, onDelete, modalTitle } = this.props;

    const input_disabled = this.state.activeItem.subscription ? true : false;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
        <ModalBody>
          <Form>
            { this.state.activeItem.id ? (
              <FormGroup row>
                <Label sm={6}>Codice Prenotazione</Label>
                <Label sm={6}>{this.state.activeItem.id}</Label>
              </FormGroup> 
            ) : null}
            { this.state.activeItem.subscription ? (
              <FormGroup row>
                <Label sm={6}>Codice Abbonamento</Label>
                <Label sm={6}>{this.state.activeItem.subscription}</Label>
              </FormGroup> 
            ) : null}            
            <FormGroup row>
              <Label for="exampleSelect" sm={6}>Ombrellone</Label>
              <Col sm={6}>
                <Input type="select" name="umbrella" id="umbrella-id" onChange={this.handleChange} disabled={input_disabled || this.state.activeItem.id}>
                  <option>-</option>
                  { this.renderUmbrellaSelection() }
                  { this.state.activeItem.id && this.state.activeItem.umbrella ? (<option selected>{this.state.activeItem.umbrella.code}</option>) : null}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="sunbeds" sm={6}>Lettini</Label>
              <Col sm={6}>
                <Input type="select" name="sunbeds" id="sunbeds-id" onChange={this.handleChange} disabled={input_disabled}>
                  { this.renderSunbedsSelection() }
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <Label for="customer">Intestatario</Label>
              <Input
                type="text"
                id="customer-id"
                name="customer"
                value={this.state.activeItem.customer}
                onChange={this.handleChange}
                placeholder="Immetti nome cliente"
                disabled={input_disabled}
              />
            </FormGroup>
            <FormGroup row>
              <Label sm={6} for="date">Data</Label>
              <Col sm={6}>
                <Input type="date" name="date" id="date" value={this.state.activeItem.date} onChange={this.handleChange} disabled={input_disabled || this.state.activeItem.id} />
              </Col>
            </FormGroup>
            <FormGroup>
              { this.state.activeItem.id ? (
                <CustomInput type="switch" id="switch-paid" name="paid" label="Pagato"
                  defaultChecked={this.state.activeItem.paid} onChange={this.handleChange} disabled={input_disabled} />
              ) : (
                <CustomInput type="switch" id="switch-paid" name="paid" label="Pagato" onChange={this.handleChange} disabled={input_disabled} />
              ) }
            </FormGroup>
          </Form>
        </ModalBody>   
        <ModalFooter>
          { this.state.activeItem.id ? (
            <Button color="secondary" onClick={() => onSave(this.state.activeItem, "print")}>
              {"Stampa ticket"}
            </Button>
          ) : (
            <Button color="secondary" onClick={() => onSave(this.state.activeItem, "save-print")}>
              { "Crea e stampa ticket" }
            </Button>)
          }
          { !this.state.activeItem.subscription ? (
            <Button color="success" onClick={() => onSave(this.state.activeItem, "save")}>
              { this.state.activeItem.id ? "Salva modifiche" : "Crea" }
            </Button>        
          ) : null }          
          { this.state.activeItem.id && !this.state.activeItem.subscription ? (
            <Button className="btn btn-danger" onClick={() => onDelete(this.state.activeItem)}>
              Rimuovi
            </Button>         
          ) : null }  
        </ModalFooter>
      </Modal>
    );
  }
}