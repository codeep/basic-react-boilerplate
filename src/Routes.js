import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { NotFound } from './components'
import { HomeMain, EmailMain, ContactsMainContainer, NotificationsMain } from './containers'

class Routes extends Component {
	render() {
		return(
			<Switch>
				<Route path="/home" component={HomeMain} />
				<Route path="/email" component={EmailMain} />
				<Route path="/contacts" component={ContactsMainContainer} />
				<Route path="/notifications" component={NotificationsMain} />
				<Route component={NotFound} />
			</Switch>
		)
	}
}

export default Routes
