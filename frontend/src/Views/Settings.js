import React, { Component } from "react";
import Notification from "../components/Notification";
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Collapse,
} from "reactstrap";
import axios from "axios";
import 'react-tiny-fab/dist/styles.css';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenCollapse: false,
      myAlert: {show: false, title: "Notifica", text: "", backgroundColor: ""},
      isLoading: true,
      addingSeason: false,
      editingSeason: false,
      invalidNewSeason: false
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios.all([
      axios.get("/api/seasons/"),
      axios.get("/api/season/active/")
    ])
    .then(axios.spread((seasonsRes, activeSeason) => {
      this.setState({ 
        seasonsList: seasonsRes.data,
        activeSeason: activeSeason.data
      });
    }))
    .catch((err) => console.log(err))
    .finally(() => {
      this.setState({ isLoading: false });
    })
  };

  handleSubmitLoadSeason = () => {

    const s = this.state.selectedSeasonToLoad

    var item = this.state.seasonsList.find(obj => obj.season === s);
    item['active'] = true

    axios
      .put(`/api/seasons/${item.season}/`, item)
      .then((res) => {
        this.refreshList();
        
        this.updateAlert("Carimamento nuova stagione avvenuto con successo", "lightgreen");
        this.toggleAlert();
      })
      .catch((err) => {
        console.log(err)
        this.updateAlert("Carimamento nuova stagione fallito", "lightcoral");
        this.toggleAlert();
      });
  };

  handleSubmitSeason = () => {

    if (this.state.invalidNewSeason) {
      return;
    }
    if (this.state.addingSeason) {
      this.handleSubmitNewSeason()
    } else {
      this.handleSubmitUpdateSeason()
    }

    this.toggleCollapse();
    this.setState({ 
      addingSeason: false,
      editingSeason: false,
    });
  };

  handleSubmitNewSeason = () => {

    const item = this.state.newSeason

    axios
      .post("/api/seasons/", item)
      .then((res) => {
        this.refreshList();
        
        this.updateAlert("Inserimento avvenuto con successo", "lightgreen");
        this.toggleAlert();
      })
      .catch((err) => {
        console.log(err)
        this.updateAlert("Inserimento fallito", "lightcoral");
        this.toggleAlert();
      });
  };

  handleSubmitUpdateSeason = () => {

    const item = this.state.activeSeason

    axios
      .put(`/api/seasons/${item.season}/`, item)
      .then((res) => {
        this.refreshList();
        
        this.updateAlert("Aggiornamento avvenuto con successo", "lightgreen");
        this.toggleAlert();
      })
      .catch((err) => {
        console.log(err)
        this.updateAlert("Aggiornamento fallito", "lightcoral");
        this.toggleAlert();
      });
  };

  updateAlert = (text, color) => {
    var myAlert = {...this.state.myAlert};
    myAlert.text = text;
    myAlert.backgroundColor = color;
    
    this.setState({ myAlert })
  }

  toggleAlert = () => {
    let myAlert = {...this.state.myAlert};
    myAlert.show = !myAlert.show;

    // this.setState({ myAlert });

    this.setState({ myAlert }, () => {
      window.setTimeout(() => {
        let myAlert = {...this.state.myAlert};
        myAlert.show = !myAlert.show;
        this.setState({ myAlert })
      }, 4000)
    });
  };

  toggleCollapse = () => {
    this.setState({ 
      isOpenCollapse: !this.state.isOpenCollapse 
    });
  }

  handleChangeSeason = (e) => {

    let { name, value, checked, type } = e.target;

    if (this.state.addingSeason) {
      if (name == "season" && value.length > 4) {
        this.setState({ invalidNewSeason: true });
      }
      if (name == "season" && value.length == 4 && !/^\d{4}$/.test(value)) {
        this.setState({ invalidNewSeason: true });
      }
      if (name == "season" && value.length == 4 && /^\d{4}$/.test(value)) {
        this.setState({ invalidNewSeason: false });
      }
      const newSeason = { ...this.state.newSeason, [name]: value };

      console.log("New Season updated: ");
      console.log(newSeason);
      this.setState({ newSeason });
    } else {
      const activeSeason = { ...this.state.activeSeason, [name]: value };

      console.log("Active Season updated: ");
      console.log(activeSeason);
      this.setState({ activeSeason });
    }
  };

  handleChangeLoadSeason = (e) => {

    this.setState({ selectedSeasonToLoad: e.target.value });
  };

  handleAddSeasonToggle = () => {
    this.setState({ 
      addingSeason: true,
      editingSeason: false,
      newSeason: {
        season: "",
        start_date: "",
        end_date: ""
      }
    });
    this.toggleCollapse()
  };

  handleEditSeasonToggle = () => {
    this.setState({ 
      addingSeason: false,
      editingSeason: true,
    });
    this.toggleCollapse()
  };

  renderSeasonsSelection = () => {

    const list = this.state.seasonsList;

    return list.map((item, index) => (
      <option key={index} selected={item.active == true}>
        {item.season}
      </option>
    ));
  }

  render() {

    if (this.state.isLoading) return null;

    return (
      <Container fluid className="pt-5">
        <h1 className="text-black text-uppercase text-center my-4">Impostazioni</h1>
        <Notification 
          // onToggle={this.toggleAlert}
          show={this.state.myAlert.show}
          title={this.state.myAlert.title}
          text={this.state.myAlert.text}
          backgroundColor={this.state.myAlert.backgroundColor}
        />
        <Row className="mb-3">
          <Col sm={{ size: 6, offset: 3 }}>
            <h3>Stagione corrente: {this.state.activeSeason ? this.state.activeSeason.season : ''}</h3>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={{ size: 6, offset: 3 }}>
            <Button color="primary" onClick={this.handleEditSeasonToggle} className="mr-2">Modifica stagione</Button>
            <Button color="success" onClick={this.handleAddSeasonToggle}>Aggiungi nuova stagione</Button>
          </Col>
        </Row>
        <Collapse isOpen={this.state.isOpenCollapse}>
          <Row className="mb-3 mt-6">
            <Col sm={{ size: 6, offset: 3 }}>
              <Form>
                {this.state.addingSeason ? (
                  <FormGroup row>
                  <Label for="season-id" sm={3}>
                    Anno
                  </Label>
                  <Col sm={9}>
                    <Input {...this.state.invalidNewSeason ? {invalid: true} : ''}
                      id="season-id"
                      name="season"
                      type="text"
                      placeholder="Inserisci l'anno della stagione"
                      value={this.state.newSeason.season}
                      onChange={this.handleChangeSeason}
                    />
                  </Col>
                </FormGroup>
                ) : ("")}
                <FormGroup row>
                  <Label for="startDate-id" sm={3}>
                    Inizio stagione
                  </Label>
                  <Col sm={9}>
                    <Input
                      id="startDate-id"
                      name="start_date"
                      type="date"
                      value={this.state.addingSeason ? this.state.newSeason.start_date : this.state.activeSeason.start_date}
                      onChange={this.handleChangeSeason}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="endDate-id" sm={3}>
                    Fine stagione
                  </Label>
                  <Col sm={9}>
                    <Input
                      id="endDate-id"
                      name="end_date"
                      type="date"
                      value={this.state.addingSeason ? this.state.newSeason.end_date : this.state.activeSeason.end_date}
                      onChange={this.handleChangeSeason}
                    />
                  </Col>
                </FormGroup>
                <FormGroup check row>
                  <Col
                    sm={{
                      offset: 3,
                      size: 9
                    }}
                  >
                    <Button onClick={this.handleSubmitSeason} color="success">Salva</Button>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Collapse>
        <Row className="mb-3">
          <Col sm={{ size: 6, offset: 3 }}>
            <h3>Attiva altra stagione</h3>
            <Form inline>
              <FormGroup>
                <Input type="select" name="season" id="season-id" onChange={this.handleChangeLoadSeason}>
                  { this.renderSeasonsSelection() }
                </Input>
              </FormGroup>
              <FormGroup>
                <Button onClick={this.handleSubmitLoadSeason} color="success">
                  Carica
                </Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>

    );
  }
}

export default Settings;