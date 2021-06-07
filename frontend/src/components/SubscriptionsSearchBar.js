import React, { Component } from "react";
import { Form, Button, Label, Input, FormGroup, CustomInput } from 'reactstrap';

class SubscriptionsSearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(
        this
    );
    this.handleShowUnpaidChange = this.handleShowUnpaidChange.bind(
        this
    );
    this.handleShowUmbrellasChange = this.handleShowUmbrellasChange.bind(
      this
    );
    this.handleShowBeachLoungersChange = this.handleShowBeachLoungersChange.bind(
      this
    );
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }
  
  handleShowUnpaidChange(e) {
    this.props.onUnpaidItemsChange(e.target.checked);
  }

  handleShowUmbrellasChange(e) {
    this.props.onShowUmbrellasChange(e.target.checked);
  }

  handleShowBeachLoungersChange(e) {
    this.props.onShowBeachLoungersChange(e.target.checked);
  }

  render() {
    const searchText = this.props.searchText;
    const itemsUnpaid = this.props.itemsUnpaid;
    const showBeachLoungers = this.props.showBeachLoungers;
    const showUmbrellas = this.props.showUmbrellas;

    return (
      <Form inline>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="searchText" className="mr-sm-2">Ricerca</Label>
          <Input type="text" name="searchText" id="searchText" 
                 value={searchText} onChange={this.handleFilterTextChange} />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <CustomInput type="switch" id="showUnpaidSubscription" name="showUnpaidSubscription" checked={itemsUnpaid}
                       onChange={this.handleShowUnpaidChange} label="Mostra abbonamenti da pagare" />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <CustomInput type="switch" id="showUmbrella" name="showUmbrella" checked={showUmbrellas}
                       onChange={this.handleShowUmbrellasChange} label="Mostra solo ombrelloni" />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <CustomInput type="switch" id="showBeachLoungers" name="showBeachLoungers" checked={showBeachLoungers}
                       onChange={this.handleShowBeachLoungersChange} label="Mostra solo lettini" />
        </FormGroup>
      </Form>
    );
  }
}

export default SubscriptionsSearchBar;