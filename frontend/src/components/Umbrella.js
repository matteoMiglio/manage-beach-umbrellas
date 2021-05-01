import React, { Component, useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Umbrella extends Component {
    constructor(props) {
        super(props);
        //const [dropdownOpen, setDropdownOpen] = useState(false);
      }

  toggle = () => {
        this.setDropdownOpen(prevState => !prevState);
  }

  render() {
    return (
        <Dropdown isOpen={this.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
            Dropdown
        </DropdownToggle>
        <DropdownMenu>
            <DropdownItem header>Header</DropdownItem>
            <DropdownItem>Some Action</DropdownItem>
            <DropdownItem text>Dropdown Item Text</DropdownItem>
            <DropdownItem disabled>Action (disabled)</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Foo Action</DropdownItem>
            <DropdownItem>Bar Action</DropdownItem>
            <DropdownItem>Quo Action</DropdownItem>
        </DropdownMenu>
        </Dropdown>
    );
  }
}

export default Umbrella;