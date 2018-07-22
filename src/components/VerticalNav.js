import React from 'react';
import { Link } from 'react-router-dom';

export const VerticalNav = ({path}) => {
  return (
  	<aside className="nav-sidebar">
    	<h1 className="brand fs24 tc tu">MC</h1>
  		<nav className="nav">
  			<ul id="sidebar">
  				<li id = "_home" className="nav__item">
  					<Link className={(path === '/home' ? 'active ' : '')  + "nav__link db pr trans-background "} to="/home">
  						<span className="nav__icon sprite home">Home</span>
  					</Link>
  				</li>
  				<li id="_contacts" className="nav__item _contacts">
  					<Link className={(path === '/contacts' ? 'active ' : '')  + "nav__link db pr trans-background "} to="/contacts">
  						<span className="nav__icon sprite phone-book">Phone book</span>
  					</Link>
  				</li>
  				<li id = "_call_logs" className="nav__item">
  					<Link className={(path === '/call_logs' ? 'active ' : '')  + "nav__link db pr trans-background "} to="/call_logs">
  						<span className="nav__icon sprite phone">Phone</span>
  					</Link>
  				</li>
  				<li id="_dialogs" className="nav__item">
  					<Link className={(path === '/dialogs' ? 'active ' : '')  + "nav__link db pr trans-background "} to="/dialogs">
  						<span className="nav__icon sprite message">
  							Messages<span className="notification-ring font-bold roboto-medium tc  dn ">
  							</span>
  						</span>
  					</Link>
  				</li>
  				<li id="_email-page-icon" className="nav__item">
  					<Link className={(path === '/email' ? 'active ' : '')  + "nav__link db pr trans-background "} to="/email">
  						<span className="nav__icon sprite email">Email</span>
  					</Link>
  				</li>
  				<li id = "_calendar" className="nav__item">
  					<Link className={(path === '/calendar' ? 'active ' : '')  + "nav__link db sprite-b pr trans-background "} to="/calendar">
  						<span className="nav__icon sprite calendar">Calendar<span className="nav__number db fs20 tc">29</span></span>
  					</Link>
  				</li>
  				<li className="nav__item _files">
  					<Link className={(path === '/files' ? 'active ' : '')  + "nav__link db sprite-b pr trans-background "} to="/files">
  						<span className="nav__icon sprite folders">File manager</span>
  					</Link>
  				</li>
  				<li className="nav__item _notifications">
  					<Link className={(path === '/notifications' ? 'active ' : '')  + "nav__link db sprite-b pr trans-background notification-bg"} to="/notifications">
  						<span className="nav__icon sprite ring">Notifications<span className="notification-ring font-bold roboto-medium tc">2</span></span>
  					</Link>
  				</li>
  			</ul>
  		</nav>
  	</aside>
  )
}
