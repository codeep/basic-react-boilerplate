import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { VerticalNav, Header } from './components'
import Routes from './Routes'

class App extends Component {
	
	componentDidMount() {
		const {pathname} = this.props.location;
		if(pathname === '/') this.props.history.push('/home')
	}

	render() {
		const {pathname} = this.props.location
		return(
			<div>
				<VerticalNav path={pathname}/>
				<Header/>
				<Routes />
			</div>
		)
	}
}

export default withRouter(App)
