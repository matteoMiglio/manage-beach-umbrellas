import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import Reservations from './Views/Reservations';
import Subscriptions from './Views/Subscriptions';
import Umbrellas from './Views/Umbrellas';
import Home from './Views/Home';

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route path="/umbrellas" component={Umbrellas} />
          <Route path="/reservations" component={Reservations} />
          <Route path="/subscriptions" component={Subscriptions} />
          <Redirect to="/home" />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;