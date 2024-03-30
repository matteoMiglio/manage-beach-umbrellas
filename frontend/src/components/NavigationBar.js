import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';


class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  toggle = () => {
    this.setState({ 
      isOpen: !this.state.isOpen 
    });
  }

  render() {

    return (
      <Navbar color="light" light="true" fixed="top" expand="md">
        <NavbarBrand href="/home" className="me-auto">Palm Beach</NavbarBrand>
        <NavbarToggler onClick={this.toggle} className="me-2"/>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/umbrellas">Ombrelloni</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/subscriptions">Abbonamenti</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/reservations">Prenotazioni</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/settings">Impostazioni</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default NavigationBar;