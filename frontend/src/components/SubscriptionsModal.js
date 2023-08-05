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
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import it from 'date-fns/locale/it';
registerLocale('it', it);

const heighSelect = {
  height: '120px'
}

export default class SubscriptionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      umbrellaList: [],
      start_date: this.props.activeItem.start_date ? new Date(this.props.activeItem.start_date) : null,
      end_date: this.props.activeItem.end_date ? new Date(this.props.activeItem.end_date) : null,
    };
  }

  onChangeDateRange = (dates) => {
    const [start, end] = dates;
    const start_date = start;
    const end_date = end;
    this.setState({ start_date, end_date });

    const activeItem = { ...this.state.activeItem };

    if (start_date) {
      let tmp = start_date.toLocaleDateString();
      activeItem.start_date = tmp.split("/")[2] + "-" + tmp.split("/")[1] + "-" + tmp.split("/")[0];
    }
    else {
      activeItem.start_date = null;
    }

    if (end_date) {
      let tmp = end_date.toLocaleDateString();
      activeItem.end_date = tmp.split("/")[2] + "-" + tmp.split("/")[1] + "-" + tmp.split("/")[0];
    }
    else{
      activeItem.end_date = null;
    }

    this.setState({ activeItem });
  };

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

  handleChange = (e) => {

    let { name, value, checked, type } = e.target;

    // scelta multipla del giorno - abbonamento personalizzato
    if (name === "customDays") {
      let days = this.state.activeItem.customDays;
      if (checked) {
        days.push(value);
      } else {
        const index = days.indexOf(value);
        if (index > -1) {
          days.splice(index, 1);
        }
      }
      value = days.sort();
    }

    // scelta multipla del mese - abbonamento personalizzato
    if (type === "select-multiple") {
      value = Array.from(e.target.selectedOptions, option => option.value);
    }

    if (type === "checkbox" && name != "customDays") {
      value = checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    console.log("Active Item updated: ");
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
    freePeriodList.push({start_date: null, end_date: null});

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

    const list = this.state.umbrellaList;

    return list.map((item, index) => (
      <option key={index} selected={item.code == this.state.activeItem.umbrella.code}>
        {item.code}
      </option>
    ));
  }

  renderSunbedsSelection = () => {

    const sunbedsList = [1,2,3,4,5]

    return sunbedsList.map((item) => (
      <option key={item} selected={item == this.state.activeItem.sunbeds}>
        {item}
      </option>
    ));
  }

  render() {
    const CustomInputDatePicker = React.forwardRef(
      ({ value, onClick }, ref) => (
        <Button style={{backgroundColor: "#037bfe"}} onClick={onClick} ref={ref}>
          {value ? value : "clicca per inserire"}
        </Button>
      )
    );

    const { toggle, onSave, onDelete, modalTitle } = this.props;

    const { customDays, customMonths } = this.state.activeItem;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
        <ModalBody>
          <Form>
            {this.state.activeItem.id ? (
              <FormGroup row>
                <Label sm={6}>Codice Abbonamento</Label>
                <Label sm={6}>{this.state.activeItem.code}</Label>
              </FormGroup>
            ) : null }
            <FormGroup row>
              <Label for="exampleSelect" sm={6}>Ombrellone</Label>
              <Col sm={6}>
                <Input type="select" name="umbrella" id="position-id" onChange={this.handleChange} disabled={this.state.activeItem.id}>
                  <option>-</option>
                  { this.renderUmbrellaSelection() }
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="exampleSelect" sm={6}>Lettini</Label>
              <Col sm={6}>
                <Input type="select" name="sunbeds" id="sunbeds-id" onChange={this.handleChange}>
                  {this.renderSunbedsSelection()}
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
            <Row form className="mt-4">
              <Col sm={4}>
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
              </Col>
              <Col sm={{size: 4}}>
                <FormGroup>
                  <Input
                    type="text"
                    id="total-id"
                    name="total"
                    value={this.state.activeItem.total}
                    onChange={this.handleChange}
                    placeholder="Totale €"
                  />
                </FormGroup>
              </Col>
              <Col sm={{size: 4}}>
                <FormGroup>
                  <Input
                    type="text"
                    id="deposit-id"
                    name="deposit"
                    value={this.state.activeItem.deposit}
                    onChange={this.handleChange}
                    placeholder="Acconto €"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="subcriptionType">Tipo abbonamento</Label>
              <div>
                <CustomInput type="radio" id="type_seasonal" name="type" label="Stagionale" 
                             value="S" defaultChecked={this.state.activeItem.type === "S"} 
                             onChange={this.handleChange}
                             disabled={this.state.activeItem.id}  />
                <CustomInput type="radio" id="type_periodic" name="type" label="Periodo" 
                             value="P" defaultChecked={this.state.activeItem.type === "P"} 
                             onChange={this.handleChange}
                             disabled={this.state.activeItem.id} />
                <CustomInput type="radio" id="type_custom" name="type" label="Personalizzato" 
                             value="C" defaultChecked={this.state.activeItem.type === "C"} 
                             onChange={this.handleChange}
                             disabled={this.state.activeItem.id} />
              </div>
            </FormGroup>
            {this.state.activeItem.type === "P" ? (
              <FormGroup row>
                <Label for="exampleDate" sm={5}>Seleziona periodo</Label>
                <Col sm={{size: 7}}>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    calendarStartDay={1}
                    selectsRange={true}
                    startDate={this.state.start_date}
                    endDate={this.state.end_date}
                    locale="it"
                    customInput={<CustomInputDatePicker />}
                    // shouldCloseOnSelect={false}
                    // isClearable={true}
                    onChange={this.onChangeDateRange}
                    disabled={this.state.activeItem.id}
                  />
                </Col>
              </FormGroup>
            ) : null}
            {this.state.activeItem.type === "C" ? (
              <Row form>
                <Col sm={12} className="mt-3">
                  <Row>
                    <Col sm={3}>
                      <Label>Si ripete il</Label>
                    </Col>
                    <Col sm={8}>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={0} 
                                 defaultChecked={customDays.includes("0")} onChange={this.handleChange} disabled={this.state.activeItem.id} />L
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={1} 
                                 defaultChecked={customDays.includes("1")} onChange={this.handleChange} disabled={this.state.activeItem.id} />M
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={2} 
                                 defaultChecked={customDays.includes("2")} onChange={this.handleChange} disabled={this.state.activeItem.id} />M
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={3} 
                                 defaultChecked={customDays.includes("3")} onChange={this.handleChange} disabled={this.state.activeItem.id} />G
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={4} 
                                 defaultChecked={customDays.includes("4")} onChange={this.handleChange} disabled={this.state.activeItem.id} />V
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={5} 
                                 defaultChecked={customDays.includes("5")} onChange={this.handleChange} disabled={this.state.activeItem.id} />S
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input type="checkbox" name="customDays" value={6}
                                 defaultChecked={customDays.includes("6")} onChange={this.handleChange} disabled={this.state.activeItem.id} />D
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col sm={12} className="mt-3">
                  <FormGroup>
                    <Label for="customMonths">Nel periodo</Label>
                    <Input
                      type="select"
                      name="customMonths"
                      id="customMonths-id"
                      onChange={this.handleChange}
                      disabled={this.state.activeItem.id}
                      style={heighSelect}
                      multiple
                    >
                      <option value={5} selected={customMonths.includes("5")}>Maggio</option>
                      <option value={6} selected={customMonths.includes("6")}>Giugno</option>
                      <option value={7} selected={customMonths.includes("7")}>Luglio</option>
                      <option value={8} selected={customMonths.includes("8")}>Agosto</option>
                      <option value={9} selected={customMonths.includes("9")}>Settembre</option>
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
          { this.state.activeItem.id ? (
            <Button color="secondary" onClick={() => onSave(this.state.activeItem, "save-print")}>
              {"Stampa ticket"}
            </Button>
          ) : (
            <Button color="secondary" onClick={() => onSave(this.state.activeItem, "save-print")}>
              { "Crea e stampa ticket" }
            </Button>
          )}

          <Button color="success" onClick={() => onSave(this.state.activeItem, "save")}>
            { this.state.activeItem.id ? "Salva modifiche" : "Crea" }
          </Button>

          { this.state.activeItem.id ? (
            <Button className="btn btn-danger" onClick={() => onDelete(this.state.activeItem)}>
              Rimuovi
            </Button>         
          ) : null }  
        </ModalFooter>
      </Modal>
    );
  }
}