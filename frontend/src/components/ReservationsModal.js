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

const umbrellaListConst = [
  {
    id: 1,
    position: "A1",
  },
  {
    id: 2,
    position: "A2",
  },
  {
    id: 3,
    position: "B1",
  },
  {
    id: 4,
    position: "B2",
  },
];

export default class ReservationsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      umbrellaList: umbrellaListConst,
      periodicSubscriptions: false,
      customSubscriptions: false,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  renderUmbrellaSelection = () => {

    const list = this.state.umbrellaList

    return list.map((item) => (
      <option selected={item.position == this.state.activeItem.position}>
        {item.position}
      </option>
    ));
  }

  renderBeachLoungersSelection = () => {

    const beachLoungersList = [1,2,3,4,5]

    return beachLoungersList.map((item) => (
      <option selected={item == this.state.activeItem.beachLoungers}>
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
                <Input type="select" name="position" id="position-id">
                  <option>-</option>
                  {this.renderUmbrellaSelection()}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="exampleSelect" sm={6}>Lettini</Label>
              <Col sm={6}>
                <Input type="select" name="beach_loungers" id="beach_loungers-id">
                  {this.renderBeachLoungersSelection()}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <Label for="customerName">Intestatario</Label>
              <Input
                type="text"
                id="customerName-id"
                name="customerName"
                value={this.state.activeItem.customerName}
                onChange={this.handleChange}
                placeholder="Immetti nome cliente"
              />
            </FormGroup>
            <FormGroup row>
              <Label sm={6} for="exampleDate">Data</Label>
              <Col sm={6}>
                <Input type="date" name="date" id="exampleDate" />
              </Col>
            </FormGroup>
            <FormGroup>
              <div>
                <CustomInput type="switch" id="switch-state" name="paid" label="Pagato" />
              </div>
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