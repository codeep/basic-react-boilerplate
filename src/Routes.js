import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { NotFound } from './components';
import { HomeMain, EmailMain } from './containers';

class Routes extends Component {
	render() {
		return(
			<Switch>
        <Route path="/home" component={HomeMain} />
        <Route path="/email" component={EmailMain} />
  			<Route component={NotFound} />
      </Switch>
		);
	}
}

export default Routes;
