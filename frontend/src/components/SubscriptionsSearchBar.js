import React, { Component } from "react";
import { Form, Button, Label, Input, FormGroup } from 'reactstrap';

class SubscriptionsSearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(
        this
    );
    this.handleShowPaidChange = this.handleShowPaidChange.bind(
        this
    );
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }
  
  handleShowPaidChange(e) {
    this.props.onPaidItemsChange(e.target.checked);
  }

  render() {
    const searchText = this.props.searchText;
    const itemsPaid = this.props.itemPaid;

    return (
      <Form inline>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="searchText" className="mr-sm-2">Ricerca</Label>
          <Input type="text" name="searchText" id="searchText" 
                 value={searchText} onChange={this.handleFilterTextChange} />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0" check>
          <Label for="exampleCheck" check>Mostra abbonamenti pagati</Label>
          <Input type="checkbox" name="check" id="exampleCheck" 
                 checked={itemsPaid} onChange={this.handleShowPaidChange} />
        </FormGroup>
      </Form>
    );
  }
}

export default SubscriptionsSearchBar;