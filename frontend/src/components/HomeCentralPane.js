import React, { Component } from "react";
import { Table, ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody, CardText, CardTitle, CardImg } from 'reactstrap';
import BeachLoungerLogo from "../images/BeachLoungerLogo";
import UmbrellaLogo from "../images/UmbrellaLogo";

class CardUmbrella extends React.Component {
 
  constructor(props) {
    super(props);
  }

  getUmbrellaColor = (paid) => {
    let color = "";

    if (paid != null) {
      if (paid) {
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
    const showBeachLounger = this.props.showBeachLounger;

    const beachLoungersImages = [];

    const color = this.getUmbrellaColor(item.paid);

    if (item.beachLoungers == 1) {
      beachLoungersImages.push(
        <BeachLoungerLogo color="black" width={20} />
      );
    }
    else if (item.beachLoungers == 2) {
      beachLoungersImages.push(
        <div style={{display: "block"}}>
          <BeachLoungerLogo color="black" width={20} />
          <BeachLoungerLogo color="black" width={20} />
        </div>
      );
    }
    else if (item.beachLoungers == 3) {
      beachLoungersImages.push(
        <div style={{display: "block"}}>
          <BeachLoungerLogo color="black" width={20} />
          <BeachLoungerLogo color="black" width={20} />
        </div>
      );
      beachLoungersImages.push(
        <div style={{display: "block"}}>
          <BeachLoungerLogo color="black" width={20} />
        </div>
      );
    } else {
      beachLoungersImages.push(
        <div style={{display: "block"}}>
          <BeachLoungerLogo color="black" width={20} />
          <BeachLoungerLogo color="black" width={20} />
        </div>
      );
      beachLoungersImages.push(
        <div style={{display: "block"}}>
          <BeachLoungerLogo color="black" width={20} />
          <BeachLoungerLogo color="black" width={20} />
        </div>
      );
    }

    return (
      <td className="p-0">
          <Card className={this.props.className}>
            <CardTitle tag="h5" className="mb-2">{item.id}</CardTitle>
            <div>
              <UmbrellaLogo color={color} width={40} />
            </div>
            {showBeachLounger ? (            
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

  listToMatrix(list, elementsPerSubArray) {
    let matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }
      matrix[k].push(list[i]);
    }

    return matrix;
  }

  renderSingleRow = (items, showBeachLounger) => {
    const row = [];

    items.slice(0, items.length).forEach((el, index) => {

      if (index == 7) {
        row.push( 
          <td key={index+el.id} width="25px"></td>
        );
      } 

      row.push(<CardUmbrella item={el} key={el.id} showBeachLounger={showBeachLounger} className="mb-4 text-center border-0" />);
    });

    return row;
  }

  render() {
    const splitRow = this.props.splitRow;
    const matrix = this.listToMatrix(this.props.umbrellaList, splitRow);
    const showBeachLounger = this.props.showBeachLounger;
    const umbrellaTable = [];

    matrix.slice(0, matrix.length).map((item, index) => {
      // if (index == 0) {
      //   umbrellaTable.push(
      //     <tr key={index}>
      //         {this.renderFirstRow(item, showBeachLounger)}
      //     </tr>
      //   );        
      // } else {
        umbrellaTable.push(
          <tr key={index}>
              {this.renderSingleRow(item, showBeachLounger)}
          </tr>
        );
      // }
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