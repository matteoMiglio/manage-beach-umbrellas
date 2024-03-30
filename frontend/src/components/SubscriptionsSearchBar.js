import React from "react";
import { Form, Label, Input, FormGroup, CustomInput } from 'reactstrap';

class SubscriptionsSearchBar extends React.Component {

  constructor(props) {
    super(props);
  }

  handleFilterTextChange = (e) => {
    this.props.onFilterTextChange(e.target.value);
  }
  
  handleShowUnpaidChange = (e) => {
    this.props.onUnpaidItemsChange(e.target.checked);
  }

  handleShowUmbrellasChange = (e) => {
    this.props.onShowUmbrellasChange(e.target.checked);
  }

  handleShowSunbedsChange = (e) => {
    this.props.onShowSunbedsChange(e.target.checked);
  }

  handleShowSeasonalSubscriptionsChange = (e) => {
    this.props.onShowSeasonalSubscriptions(e.target.checked);
  }

  render() {
    const searchText = this.props.searchText;
    const itemsUnpaid = this.props.itemsUnpaid;
    const showSunbeds = this.props.showSunbeds;
    const showUmbrellas = this.props.showUmbrellas;
    const showSeasonalSubscriptions = this.props.showSeasonalSubscriptions;

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
          <CustomInput type="switch" id="showSunbeds" name="showSunbeds" checked={showSunbeds}
                       onChange={this.handleShowSunbedsChange} label="Mostra solo lettini" />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <CustomInput type="switch" id="ShowSeasonalSubscriptions" name="ShowSeasonalSubscriptions" checked={showSeasonalSubscriptions}
                       onChange={this.handleShowSeasonalSubscriptionsChange} label="Mostra solo stagionali" />
        </FormGroup>            
      </Form>
    );
  }
}

export default SubscriptionsSearchBar;