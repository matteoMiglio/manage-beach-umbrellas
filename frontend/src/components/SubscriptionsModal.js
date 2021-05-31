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
import faker from 'faker';
import axios from "axios";
import FormFreePeriod from "./FormFreePeriod";
import DatePicker, { registerLocale, setDefaultLocale, getDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import it from 'date-fns/locale/it';
registerLocale('it', it);


export default class SubscriptionsModal extends Component {
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

  getDateString(date) {

    if (typeof(date) === "object" && date) {
      let month = date.getMonth() + 1
      month = month > 9 ? month : "0" + month
      let day = date.getDate()
      day = day > 9 ? day : "0" + day
      return date.getFullYear() + "-" + month + "-" + day
    }
    else
      return null
  }

  createNewCode = () => {
    var newCode = 1000 + faker.datatype.number(100)

    const activeItem = { ...this.state.activeItem, code: newCode };
    this.setState({ activeItem });

    return newCode;
  }

  handleChange = (e) => {

    let name = e.target.name;
    let value = e.target.value;

    if (name === "customDays") {
      let days = this.state.activeItem.customDays;
      days.push(value);
      value = days;
    }

    if (e.target.type === "select-multiple") {
      value = Array.from(e.target.selectedOptions, option => option.value);
    }

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    console.log("Item updated:")
    console.log(activeItem);
    this.setState({ activeItem });
  };

  handleChangeFreePeriod = (event, i) => {

    let freePeriodList = [...this.state.activeItem.freePeriodList];
    freePeriodList[i][event.target.name] = event.target.value;

    const activeItem = { ...this.state.activeItem, freePeriodList: freePeriodList };
    this.setState({ activeItem });
  }

  handlePeriodicInputChange(update) {
    console.log(update);
    const activeItem = { ...this.state.activeItem, dateRange: update };

    this.setState({ activeItem });
  }

  handleAddClickFreePeriod() {
    let freePeriodList = [...this.state.activeItem.freePeriodList];
    freePeriodList.push({startDate: null, endDate: null});

    const activeItem = { ...this.state.activeItem, freePeriodList: freePeriodList};
    this.setState({ activeItem });
  }

  handleRemoveClickFreePeriod(i) {
    let freePeriodList = [...this.state.activeItem.freePeriodList];
    freePeriodList.splice(i, 1);

    const activeItem = { ...this.state.activeItem, freePeriodList: freePeriodList };
    this.setState({ activeItem });
  }

  renderUmbrellaSelection = () => {

    const list = this.state.umbrellaList

    return list.map((item, index) => (
      <option key={index} selected={item.code == this.state.activeItem.umbrella}>
        {item.code}
      </option>
    ));
  }

  renderBeachLoungersSelection = () => {

    const beachLoungersList = [1,2,3,4,5]

    return beachLoungersList.map((item) => (
      <option key={item} selected={item == this.state.activeItem.beachLoungers}>
        {item}
      </option>
    ));
  }

  render() {
    const { toggle, onSave } = this.props;
    const title = this.props.modal_title;
    // const [startDate, endDate] = this.state.activeItem.dateRange;
    const startDatePeriodicSubscriptions = this.getDateString(this.state.activeItem.startDate);
    const endDatePeriodicSubscriptions = this.getDateString(this.state.activeItem.endDate);

    const subscriptionCode = this.state.activeItem.code ? this.state.activeItem.code : this.createNewCode()

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label sm={6}>Codice Abbonamento</Label>
              <Label sm={6}>{subscriptionCode}</Label>
            </FormGroup> 
            <FormGroup row>
              <Label for="exampleSelect" sm={6}>Ombrellone</Label>
              <Col sm={6}>
                <Input type="select" name="umbrella" id="position-id" onChange={this.handleChange}>
                  <option>-</option>
                  {this.renderUmbrellaSelection()}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="exampleSelect" sm={6}>Lettini</Label>
              <Col sm={6}>
                <Input type="select" name="beachLoungers" id="beach_loungers-id" onChange={this.handleChange}>
                  {this.renderBeachLoungersSelection()}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup>
              <Label for="customerName">Intestatario</Label>
              <Input
                type="text"
                id="customerName-id"
                name="customer"
                value={this.state.activeItem.customer}
                onChange={this.handleChange}
                placeholder="Immetti nome cliente"
              />
            </FormGroup>
            <FormGroup>
              <div>
                { this.state.activeItem.id ? (
                  <CustomInput type="switch" id="switch-state" name="paid" label="Pagato"
                      defaultChecked={this.state.activeItem.paid} onChange={this.handleChange} />
                ) : (
                  <CustomInput type="switch" id="switch-state" name="paid" label="Pagato" onChange={this.handleChange} />
                ) }
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="subcriptionType">Tipo abbonamento</Label>
              <div>
                <CustomInput type="radio" id="type_seasonal" name="subscriptionType" label="Stagionale" 
                             value="S" defaultChecked={this.state.activeItem.subscriptionType === "S"} 
                             onChange={this.handleChange} />
                <CustomInput type="radio" id="type_periodic" name="subscriptionType" label="Periodo" 
                             value="P" defaultChecked={this.state.activeItem.subscriptionType === "P"} 
                             onChange={this.handleChange} />
                <CustomInput type="radio" id="type_custom" name="subscriptionType" label="Personalizzato" 
                             value="C" defaultChecked={this.state.activeItem.subscriptionType === "C"} 
                             onChange={this.handleChange} />
              </div>
            </FormGroup>
            {this.state.activeItem.subscriptionType === "P" ? (
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="startDatePeriodicSubcscription">Data Inizio</Label>
                    <Input type="date" name="startDate" id="startDatePeriodicSubcscription"
                           value={startDatePeriodicSubscriptions} onChange={this.handleChange} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="endDatePeriodicSubcscription">Data Fine</Label>
                    <Input type="date" name="endDate" id="endDatePeriodicSubcscription"
                           value={endDatePeriodicSubscriptions} onChange={this.handleChange} />
                  </FormGroup>
                </Col>
              </Row>
              // <FormGroup row>
              //   <Label for="exampleDate" sm={6}>Periodo dell'abbonamento</Label>
              //   <Col sm={6}>
              //     {/* <DatePicker
              //       selectsRange={true}
              //       startDate={startDate}
              //       endDate={endDate}
              //       locale="it"
              //       shouldCloseOnSelect={false}
              //       onChange={(update) => this.handlePeriodicInputChange(update)}
              //       // isClearable={true}
              //     /> */}
              //   </Col>
              // </FormGroup>
            ) : null}
            {this.state.activeItem.subscriptionType === "C" ? (
              <Row form>
                {/* <Col sm={12}>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={4}>Ripeti ogni</Label>
                    <Col sm={2} className='px-2'>
                      <Input type="select" name="select" id="exampleSelect" size="sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </Col>
                    <Col sm={4}>
                      <Input type="select" name="select" id="exampleSelect" size="sm">
                        <option>settimana</option>
                      </Input>
                    </Col>
                  </FormGroup>
                </Col> */}
                <Col sm={12} className="mt-3">
                  <Row>
                    <Col sm={3}>
                      <Label>Si ripete il</Label>
                    </Col>
                    <Col sm={8}>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={1} onChange={this.handleChange} />L
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={2} onChange={this.handleChange} />M
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={3} onChange={this.handleChange} />M
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={4} onChange={this.handleChange} />G
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={5} onChange={this.handleChange} />V
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={6} onChange={this.handleChange} />S
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={0} onChange={this.handleChange} />D
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
                      name="customMonths"
                      id="exampleSelectMulti"
                      onChange={this.handleChange}
                      multiple
                    >
                      <option value={5}>Giugno</option>
                      <option value={6}>Luglio</option>
                      <option value={7}>Agosto</option>
                      <option value={8}>Settembre</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            ) : null}
          </Form>

          {/* <FormFreePeriod 
            values={this.state.activeItem.freePeriodList}
            onChangeInput={(event, i) => this.handleChangeFreePeriod(event, i)}
            onAddClick={() => this.handleAddClickFreePeriod()}
            onRemoveClick={(i) => this.handleRemoveClickFreePeriod(i)} /> */}
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