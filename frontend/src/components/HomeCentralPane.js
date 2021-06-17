import React, { Component } from "react";
import { Table, ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody, CardText, CardTitle, CardImg } from 'reactstrap';
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";

class CardUmbrella extends React.Component {
 
  constructor(props) {
    super(props);
  }

  getUmbrellaColor = (reservation) => {
    let color = "";

    if (reservation != null) {
      if (reservation.paid) {
        color = "red";
      } else {
        color = "orange";
      }
    }
    else {
      color = "green";
    }

    return color;
  }

  render() {
    const item = this.props.item;
    const showBeachLoungers = this.props.showBeachLoungers;
    const numBeachLoungers = item.tmp_res ? item.tmp_res.beachLoungers : item.tmp_umbrella.beachLoungers;
    const umbrellaCode = item.tmp_umbrella.code;
    const beachLoungersImages = [];

    var color = "";
    if (umbrellaCode === "")
      color = "white"
    else
      color = this.getUmbrellaColor(item.tmp_res);

    if (numBeachLoungers != 0) {
      if (numBeachLoungers == 1) {
        beachLoungersImages.push(
          <BeachLoungerLogo color="black" width={20} />
        );
      }
      else if (numBeachLoungers == 2) {
        beachLoungersImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={0} color="black" width={20} />
            <BeachLoungerLogo key={1} color="black" width={20} />
          </div>
        );
      }
      else if (numBeachLoungers == 3) {
        beachLoungersImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={0} color="black" width={20} />
            <BeachLoungerLogo key={1} color="black" width={20} />
          </div>
        );
        beachLoungersImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={2} color="black" width={20} />
          </div>
        );
      } else {
        beachLoungersImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={0} color="black" width={20} />
            <BeachLoungerLogo key={1} color="black" width={20} />
          </div>
        );
        beachLoungersImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={2} color="black" width={20} />
            <BeachLoungerLogo key={3} color="black" width={20} />
          </div>
        );
      }
    }

    return (
      <td className="p-0">
          <Card className={this.props.className}>
            <CardTitle tag="h5" className="mb-2">{umbrellaCode}</CardTitle>
            <div>
              <UmbrellaLogo color={color} width={40} />
            </div>
            {showBeachLoungers ? (            
              <div>
                {beachLoungersImages}
              </div>
            ) : null}
          </Card>
      </td>
    );
  }
}

class HomeCentralPane extends React.Component {

  constructor(props) {
    super(props);
  }

  renderSingleRow = (items, showBeachLoungers) => {
    const row = [];

    items.slice(0, items.length).forEach((item, index) => {
       
      if (index == 6) {
        row.push( 
          <td key={index+Math.floor(Math.random() * 100)+300} width="25px"></td>
        );
      } 

      row.push(<CardUmbrella item={item} key={item.tmp_umbrella.id} showBeachLoungers={showBeachLoungers} className="mb-4 text-center border-0" />);
    });

    return row;
  }

  render() {
    const showBeachLoungers = this.props.showBeachLoungers;
    const testMatrix = this.props.testMatrix;
    const umbrellaTable = [];
    
    testMatrix.slice(0, testMatrix.length).map((item, index) => {
        umbrellaTable.push(
          <tr key={index}>
              {this.renderSingleRow(item, showBeachLoungers)}
          </tr>
        );
    });

    return (
       <Table borderless responsive size="sm">
         <tbody>
          {umbrellaTable}
        </tbody>
      </Table> 
    );
  }
}

export default HomeCentralPane;