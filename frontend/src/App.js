import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import Reservations from './views/Reservations';
import Subscriptions from './views/Subscriptions';
import Umbrellas from './views/Umbrellas';
import Settings from './views/Settings';
import Home from './views/Home';

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Switch>
          <Route exact path="/home" component={Home} />
          {/* <Route path="/umbrellas" component={Umbrellas} /> */}
          <Route path="/reservations" component={Reservations} />
          <Route path="/subscriptions" component={Subscriptions} />
          <Route path="/settings" component={Settings} />
          <Redirect to="/home" />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;