import React, { Component } from 'react'
import NotificationsList from '../../components/notifications/NotificationsList'
import NotificationsDetails from '../../components/notifications/NotificationsDetails'

class NotificationsMain extends Component {

  render() {
    return (
      <div>
        <NotificationsList />
        <NotificationsDetails />
      </div>
    )
  }
}

export { NotificationsMain }