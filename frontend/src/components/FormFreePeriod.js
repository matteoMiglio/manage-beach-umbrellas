import React from "react";
import { FormGroup, Button, Label, Input, Row, Col } from 'reactstrap';

class FormFreePeriod extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            values: this.props.values
        };
    }

    handleChange(i, event) {
        let values = [...this.state.values];
        values[i].value = event.target.value;
        this.setState({ values });

        this.props.action(values);
    }

    addClick() {
        this.setState(prevState => ({
            values: [...prevState.values, { value: null}]
        }));
    }

    removeClick(i) {
        let values = [...this.state.values];
        values.splice(i, 1);
        this.setState({ values });
    }

    render() {
        return (
            <FormGroup>
                <Row className="mb-3">
                    <Col md={6}>
                        <Button color="primary" onClick={() => this.addClick()}>
                            Aggiungi periodo libero
                        </Button> 
                    </Col>
                </Row>
                {this.state.values.map((el, i) => (
                    <Row key={i}>
                        <Col sm={6}>
                            <FormGroup>
                                <Label for="feife">Data</Label>
                                {/* <Input
                                    type="date"
                                    id="startDate-id"
                                    name="startDate"
                                    onChange={this.handleChange}
                                /> */}
                                <Input
                                    type="text"
                                    value={el.value || ""}
                                    name="periodFree"
                                    onChange={this.handleChange.bind(this, i)}
                                    //onChange={this.props.action(this, i)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <Button className="btn btn-danger" onClick={() => this.removeClick(i)}>
                                Rimuovi
                            </Button>
                        </Col>
                    </Row>
                ))}

            </FormGroup>
        );
    }
}

export default FormFreePeriod;