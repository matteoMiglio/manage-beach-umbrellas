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
  Row,
  Col,
  CustomInput
} from "reactstrap";
import axios from "axios";

function fakerUmbrellas() {
  var i = 0;

  const createUmbrella = () => {
    i++;
    return {
      id: i,
      position: i,
    }
  }
  
  const createUmbrellas = (numUmbrella = 5) => {
    return new Array(numUmbrella)
      .fill(undefined)
      .map(createUmbrella);
  }
  
  return createUmbrellas(120);
}

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
    axios
      .get("/api/umbrellas/")
      .then((res) => this.setState({ umbrellaList: res.data }))
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

    // console.log("Item updated:")
    // console.log(activeItem);
    this.setState({ activeItem });
  };

  renderUmbrellaSelection = () => {

    const list = this.state.umbrellaList;

    return list.map((item) => (
      <option key={item.id} selected={item.id == this.state.activeItem.umbrella}>
        {item.id}
      </option>
    ));
  }

  renderBeachLoungersSelection = () => {

    const beachLoungersList = [1,2,3,4,5] // max numero di lettini concessi per ombrellone

    return beachLoungersList.map((item) => (
      <option key={item} selected={item == this.state.activeItem.beachLoungers}>
        {item}
      </option>
    ));
  }

  render() {
    const { toggle, onSave } = this.props;
    const title = this.props.modal_title;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>
          <Form>
            { this.state.activeItem.id ? (
              <FormGroup row>
                <Label sm={6}>Codice Prenotazione</Label>
                <Label sm={6}>{this.state.activeItem.id}</Label>
              </FormGroup> 
            ) : null}
            <FormGroup row>
              <Label for="exampleSelect" sm={6}>Ombrellone</Label>
              <Col sm={6}>
                <Input type="select" name="umbrella" id="umbrella-id" onChange={this.handleChange}>
                  <option>-</option>
                  {this.renderUmbrellaSelection()}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="beachLoungers" sm={6}>Lettini</Label>
              <Col sm={6}>
                <Input type="select" name="beachLoungers" id="beach_loungers-id" onChange={this.handleChange}>
                  {this.renderBeachLoungersSelection()}
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
              />
            </FormGroup>
            <FormGroup row>
              <Label sm={6} for="date">Data</Label>
              <Col sm={6}>
                <Input type="date" name="date" id="date" value={this.state.activeItem.date} onChange={this.handleChange} />
              </Col>
            </FormGroup>
            <FormGroup>
              { this.state.activeItem.id ? (
                <CustomInput type="switch" id="switch-paid" name="paid" label="Pagato"
                  defaultChecked={this.state.activeItem.paid} onChange={this.handleChange} />
              ) : (
                <CustomInput type="switch" id="switch-paid" name="paid" label="Pagato" onChange={this.handleChange} />
              ) }
            </FormGroup>
          </Form>
        </ModalBody>   
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.activeItem)}>
            { this.state.activeItem.id ? "Salva modifiche" : "Crea" }
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}