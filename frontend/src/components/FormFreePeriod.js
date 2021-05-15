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
    this.state = {
      values: this.props.values
    };
  }

  handleChange(i, event) {
    let values = [...this.state.values];
    values[i].value = event.target.value;
    this.setState({
      values
    });

    this.props.action(values);
  }

  addClick() {
    this.setState(prevState => ({
      values: [...prevState.values, {
        value: [null, null]
      }]
    }));
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({
      values
    });
  }

  handleDateRangeInputChange(i, update) {
    console.log(update)
    let values = [...this.state.values];
    values[i].value = update;
    this.setState({
      values
    });

    //this.props.action(values);
  }

  render() {

    return (
      <FormGroup>
        <Row className="mb-3">
          <Col md={6}>
            <Button color="primary" onClick={() => this.addClick()}>
              Aggiungi periodo libero
            </Button> 
          </Col>
        </Row>
        {this.state.values.map((el, i) => (
          <Row key={i}>
            <Col sm={8}>
              <FormGroup row>
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
                {/* <Input
                    type="text"
                    value={el.value || ""}
                    name="periodFree"
                    onChange={this.handleChange.bind(this, i)}
                    //onChange={this.props.action(this, i)}
                /> */}
                </FormGroup>
            </Col>
            <Col sm={4}>
              <Button className="btn btn-danger" size="sm" onClick={() => this.removeClick(i)}>
                Rimuovi
              </Button>
            </Col>
          </Row>
        ))}

      </FormGroup>
    );
  }
}

export default FormFreePeriod;