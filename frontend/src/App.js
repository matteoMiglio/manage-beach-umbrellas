import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import Reservations from './Views/Reservations';
import Subscriptions from './Views/Subscriptions';
import Umbrellas from './Views/Umbrellas';
import Home from './Views/Home';
import Settings from './Views/Settings';

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/umbrellas" component={Umbrellas} />
          <Route path="/reservations" component={Reservations} />
          <Route path="/subscriptions" component={Subscriptions} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;