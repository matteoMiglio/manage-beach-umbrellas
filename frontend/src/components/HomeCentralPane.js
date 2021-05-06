import React, { Component } from "react";
import { Table, Button, Card, CardBody, CardText, CardTitle, Input, FormGroup } from 'reactstrap';

class CardUmbrella extends React.Component {
 
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.item;
    var color = "";

    if (item.paid != null) {
      if (item.paid)
        color = "danger";
      else
        color = "warning";
    }
    else
      color = "success";

    return (
      <td>
        <div>
          <Card className="text-center" body color={color}>
            <CardText>{item.id}</CardText>
          </Card>
        </div>
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

  render() {
    const rows = [];
    const splitRow = this.props.splitRow;
    const matrix = this.listToMatrix(this.props.umbrellaList, splitRow);

    matrix.slice(0, matrix.length).map((item, index) => {
      rows.push(
        <tr key={index}>
          <CardUmbrella item={item[0]} key={item[0].id} />
          <CardUmbrella item={item[1]} key={item[1].id} />
          <CardUmbrella item={item[2]} key={item[2].id} />
          <CardUmbrella item={item[3]} key={item[0].id} />
          <CardUmbrella item={item[4]} key={item[1].id} />
          <CardUmbrella item={item[5]} key={item[2].id} />
          <CardUmbrella item={item[6]} key={item[0].id} />
          <CardUmbrella item={item[7]} key={item[1].id} />
          <CardUmbrella item={item[8]} key={item[2].id} />
          <CardUmbrella item={item[9]} key={item[0].id} />
        </tr>
      );
    });

    // matrix.slice(0, matrix.length).map((item, index) => {
    //   rows.push(
    //     <tr key={index}>
    //       {item.slice(0, item.length).forEach((el) => {
    //         <td key={el.id}>{el.id}</td>
    //         // <CardUmbrella item={el} key={el.id} />
    //       })}
    //     </tr>
    //   );
    // });

    return (
       <Table borderless responsive size="sm">
         <tbody>
          {rows}
        </tbody>
      </Table> 
    );
  }
}

export default HomeCentralPane;