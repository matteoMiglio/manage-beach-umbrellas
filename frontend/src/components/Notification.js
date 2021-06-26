import React, { Component } from "react";
import { Toast, ToastBody, ToastHeader } from 'reactstrap';

class Notification extends Component {
  constructor(props) {
    super(props);
    // this.handleToggle = this.handleToggle.bind(
    //   this
    // );
  }

  // handleToggle() {
  //   this.props.onToggle();
  // }

  render() {

    const {show, backgroundColor, title, text } = this.props;

    return (
      <Toast style={{position: "absolute", top: 70, right: 0, marginRight: 10, backgroundColor: backgroundColor, zIndex: 10000}} 
              isOpen={show}>
        {/* <ToastHeader toggle={this.handleToggle}> */}
        <ToastHeader>
          {title}
        </ToastHeader>
        <ToastBody>
          {text}
        </ToastBody>
      </Toast>
    )
  }
}

export default Notification;