import React, { Component } from "react";
import { Form, Button, Label, Input, FormGroup } from 'reactstrap';

class SearchBar extends React.Component {

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
                    <Label for="exampleEmail" className="mr-sm-2">Ricerca</Label>
                    <Input bsSize="sm" type="text" name="email" id="exampleEmail" 
                           value={searchText} onChange={this.handleFilterTextChange} />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0" check>
                    <Input type="checkbox" name="check" id="exampleCheck" 
                           checked={itemsPaid} onChange={this.handleShowPaidChange} />
                    <Label for="exampleCheck" check>Mostra abbonamenti pagati</Label>
                </FormGroup>
            </Form>
        );
    }
}

export default SearchBar;