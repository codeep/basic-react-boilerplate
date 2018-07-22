import React, { Component } from 'react'
import ContactsList from '../../components/contacts/ContactsList'
import ContactsDetails from '../../components/contacts/ContactsDetails'
import getContact, {getprofile} from '../../actions/contactsActions'
import { connect } from 'react-redux'

class ContactsMain extends Component {

  componentDidMount () {
    this.props.getContact()
  }

  getItem = (contact) => {
    this.props.history.push(`/contacts/profile?id=${contact.serverId}`)
    this.props.getprofile(contact.serverId)
  }

  render() {
    return (
      <div>
        <ContactsList 
          getItem={this.getItem}
          contacts={this.props.contacts}
        />
        <ContactsDetails 
          id={this.props.id}
        />
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    contacts: store.contacts.contacts,
    id: store.contacts.id
  }
}

const mapDispatchToProps = (dispatch) => ({
  getContact: () => dispatch(getContact()),
  getprofile: (id) => dispatch(getprofile(id))
})

const ContactsMainContainer = (connect(mapStateToProps, mapDispatchToProps)(ContactsMain))
export { ContactsMainContainer }