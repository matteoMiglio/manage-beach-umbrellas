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

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      umbrellaList: umbrellaListConst,
      modal_title: this.props.modal_title,
      periodicSubscriptions: false,
      customSubscriptions: false
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

  handlePeriodicRadioButtonChange = () => {
    this.setState({ customSubscriptions: false });
    this.setState({ periodicSubscriptions: !this.state.periodicSubscriptions });
  }

  handleCustomRadioButtonChange = () => {
    this.setState({ periodicSubscriptions: false });
    this.setState({ customSubscriptions: !this.state.customSubscriptions });
  }

  handleRadioButtonChange = (e) => {
    //alert("ciao" + e.value)
    this.setState({ customSubscriptions: false });
    this.setState({ periodicSubscriptions: false });
  }

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

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>{this.state.modal_title}</ModalHeader>
        <ModalBody>
          <Form>
            { this.state.activeItem.id ? (
              <FormGroup row>
                <Label sm={6}>Codice Abbonamento</Label>
                <Label sm={6}>{this.state.activeItem.id}</Label>
              </FormGroup> 
            ) : null}
            <FormGroup row>
              <Label for="exampleSelect" sm={6}>Ombrellone</Label>
              <Col sm={6}>
                <Input type="select" name="position" id="position-id">
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
            <FormGroup>
              <Label for="subcriptionType">Tipo abbonamento</Label>
              <div>
                <CustomInput type="radio" id="type_seasonal" name="subcriptionType" label="Stagionale" onChange={(item) => this.handleRadioButtonChange(item)} />
                <CustomInput type="radio" id="type_periodic" name="subcriptionType" label="Periodo" onChange={this.handlePeriodicRadioButtonChange} />
                <CustomInput type="radio" id="type_custom" name="subcriptionType" label="Personalizzato" onChange={this.handleCustomRadioButtonChange}/>
              </div>
            </FormGroup>
            {this.state.periodicSubscriptions ? (
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="exampleDate">Data Inizio</Label>
                    <Input
                      type="date"
                      id="startDate-id"
                      name="startDate"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="todo-description">Data Fine</Label>
                    <Input
                      type="date"
                      id="endDate-id"
                      name="endDate"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
            ) : null}
            {this.state.customSubscriptions ? (
              <Row form>
                <Col sm={12}>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={4}>Ripeti ogni</Label>
                    <Col sm={2} className='px-2'>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </Col>
                    <Col sm={4}>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>settimana</option>
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
                <Col sm={12} className="mt-3">
                  <Row>
                    <Col sm={3}>
                      <Label>Si ripete il</Label>
                    </Col>
                    <Col sm={8}>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" />L
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" />M
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" />M
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" />G
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" />V
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" />S
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" />D
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col sm={12} className="mt-3">
                  <FormGroup>
                    <Label for="exampleSelectMulti">Nel periodo</Label>
                    <Input
                      type="select"
                      name="selectMulti"
                      id="exampleSelectMulti"
                      multiple
                    >
                      <option>Giugno</option>
                      <option>Luglio</option>
                      <option>Agosto</option>
                      <option>Settembre</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            ) : null}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.activeItem)}>
            Salva
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}