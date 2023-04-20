import React, { Component } from "react";
import 'react-tiny-fab/dist/styles.css';
import Notification from "../components/Notification";
import axios from "axios";
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
  Container,
  CustomInput
} from "reactstrap";

class SettingsFirstForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      myAlert: {show: false, title: "Notifica", text: "", backgroundColor: ""},
    };
  }

  componentDidMount() {
    // this.refreshList();
  }

  refreshList = () => {

  };

  handleChange = (e) => {
    let { name, value } = e.target;

    const activeItem = { ...this.state.activeItem, [name]: value };

    console.log("Item updated: ");
    console.log(activeItem);
    this.setState({ activeItem });
  };

  render() {

    const { onSave } = this.props;

    return (
      <>
        <Form>
        <FormGroup row>
            <Label sm={6} for="rows_per_page-id">Righe in ogni tabella</Label>
            <Col sm={6}>  
              <Input type="select" name="rows_per_page" id="rows_per_page-id" onChange={this.handleChange}>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </Input>                        
            </Col>
          </FormGroup>            
          <FormGroup row>
            <Label sm={6} for="start_date_season-id">Data inizio stagione</Label>
            <Col sm={6}>
              {/* <Input type="date" name="start_date_season" id="start_date_season" value={this.state.activeItem.start_date_season} onChange={this.handleChange} /> */}
              <Input type="date" name="start_date_season" id="start_date_season-id" onChange={this.handleChange} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={6} for="end_date_season-id">Data fine stagione</Label>
            <Col sm={6}>
              {/* <Input type="date" name="end_date_season" id="end_date_season" value={this.state.activeItem.end_date_season} onChange={this.handleChange} /> */}
              <Input type="date" name="end_date_season" id="end_date_season-id" onChange={this.handleChange} />              
            </Col>
          </FormGroup>                        
        </Form>
        <Button color="success" onClick={() => onSave(this.state.activeItem)}>
          Salva modifiche
        </Button>    
      </>
    );
  }
}

export default SettingsFirstForm;