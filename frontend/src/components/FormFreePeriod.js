import React from "react";
import {
  FormGroup,
  Button,
  Label,
  Input,
  Row,
  Col
} from 'reactstrap';
import DatePicker, {
  registerLocale,
  setDefaultLocale,
  getDefaultLocale
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import it from 'date-fns/locale/it';
registerLocale('it', it);

class FormFreePeriod extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange(i, event) {
    this.props.onChangeInput(event, i);
  }

  // handleDateRangeInputChange(i, update) {
  //   console.log(update)
  //   let values = [...this.state.values];
  //   values[i].value = update;
  //   this.setState({
  //     values
  //   });

  //   //this.props.action(values);
  // }

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

  render() {
    const list = this.props.values;

    return (
      <FormGroup>
        <Row className="mb-3">
          <Col md={6}>
            <Button color="primary" onClick={() => this.props.onAddClick()}>
              Aggiungi periodo libero
            </Button> 
          </Col>
        </Row>
        {list.map((el, i) => (
          <Row key={i} form>
              {/* <FormGroup row>
                <Label sm={4} for="feife">Periodo {i + 1}</Label>
                <Col sm={6}>
                  <DatePicker
                    selectsRange={true}
                    startDate={el[0]}
                    endDate={el[1]}
                    locale="it"
                    shouldCloseOnSelect={false}
                    onChange={this.handleDateRangeInputChange.bind(this, i)}
                    // isClearable={true}
                  />
                </Col>
              </FormGroup> */}
            <Col sm={4}>
              <FormGroup>
                <Label size="sm" for={"startDateFreePeriod" + (i+1) + "Subscription"}>Data Inizio</Label>
                <Input size="sm" type="date" name="startDate" id={"startDateFreePeriod" + (i+1) + "Subcscription"} 
                       value={this.getDateString(el.startDate)} onChange={this.handleChange.bind(this, i)} />
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup>
                <Label size="sm" for={"endDateFreePeriod" + (i+1) + "Subscription"}>Data Fine</Label>
                <Input size="sm" type="date" name="endDate" id={"endDateFreePeriod" + (i+1) + "Subcscription"} 
                       value={this.getDateString(el.endDate)} onChange={this.handleChange.bind(this, i)} />
              </FormGroup>
            </Col>
            <Col sm={{size: 3, offset: 1}}>
              <FormGroup style={{marginTop: "38px"}}>
                <Button size="sm" className="btn btn-danger" onClick={() => this.props.onRemoveClick(i)}>
                  Rimuovi
                </Button>
              </FormGroup>
            </Col>
          </Row>
        ))}

      </FormGroup>
    );
  }
}

export default FormFreePeriod;