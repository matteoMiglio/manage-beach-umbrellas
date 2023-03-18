import React, { Component } from "react";
import { Table, UncontrolledTooltip, Card, CardBody, CardText, CardTitle } from 'reactstrap';
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
    const showSunbeds = this.props.showSunbeds;
    const numSunbeds = item.tmp_res ? item.tmp_res.sunbeds : item.tmp_umbrella.sunbeds;
    const umbrellaCode = item.tmp_umbrella.code;
    const sunbedsImages = [];

    var color = "";
    if (umbrellaCode === "")
      color = "white"
    else
      color = this.getUmbrellaColor(item.tmp_res);

    if (numSunbeds != 0) {
      if (numSunbeds == 1) {
        sunbedsImages.push(
          <BeachLoungerLogo color="black" width={20} />
        );
      }
      else if (numSunbeds == 2) {
        sunbedsImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={0} color="black" width={20} />
            <BeachLoungerLogo key={1} color="black" width={20} />
          </div>
        );
      }
      else if (numSunbeds == 3) {
        sunbedsImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={0} color="black" width={20} />
            <BeachLoungerLogo key={1} color="black" width={20} />
          </div>
        );
        sunbedsImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={2} color="black" width={20} />
          </div>
        );
      } else {
        sunbedsImages.push(
          <div style={{display: "block"}}>
            <BeachLoungerLogo key={0} color="black" width={20} />
            <BeachLoungerLogo key={1} color="black" width={20} />
          </div>
        );
        sunbedsImages.push(
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
            <CardTitle tag="h5" className="mb-2" id={"umbrella_" + item.tmp_umbrella.id}>{umbrellaCode}</CardTitle>
            {item.tmp_res ? (
                <UncontrolledTooltip placement="right" target={"umbrella_" + item.tmp_umbrella.id}>
                  {item.tmp_res.customer}
                </UncontrolledTooltip>
              ) : null}
            <div>
              <UmbrellaLogo color={color} width={40} />
            </div>
            {showSunbeds ? (            
              <div>
                {sunbedsImages}
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

  renderSingleRow = (items, showSunbeds) => {
    const row = [];

    items.slice(0, items.length).forEach((item, index) => {
       
      if (index == 6) {
        row.push( 
          <td key={index+Math.floor(Math.random() * 100)+300} width="25px"></td>
        );
      } 

      row.push(<CardUmbrella item={item} key={item.tmp_umbrella.id} showSunbeds={showSunbeds} className="mb-4 text-center border-0" />);
    });

    return row;
  }

  render() {
    const showSunbeds = this.props.showSunbeds;
    const testMatrix = this.props.testMatrix;
    const umbrellaTable = [];
    
    testMatrix.slice(0, testMatrix.length).map((item, index) => {
      umbrellaTable.push(
        <tr key={index}>
          {this.renderSingleRow(item, showSunbeds)}
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