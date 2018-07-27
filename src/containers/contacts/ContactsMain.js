import React, { Component } from 'react'
import ContactsList from '../../components/contacts/ContactsList'
import ContactsDetails from '../../components/contacts/ContactsDetails'
import getContact, {getprofile} from '../../actions/contactsActions'
import editContact from '../../actions/editContact'
import deleteContact from '../../actions/deleteContact'
import searchContact from '../../actions/searchContact'
import { connect } from 'react-redux'

class ContactsMain extends Component {

  state = {
    deleteId: ''
  }

  componentDidMount () {
    this.props.getContact()
  }

  getItem = (contact) => {
    this.props.history.push(`/contacts/profile?id=${contact.serverId}`)
    this.setState({ deleteId: contact.serverId})
    this.props.getprofile(contact.serverId)
  }

  render() {
    return (
      <div>
        <ContactsList 
          getItem={this.getItem}
          contacts={this.props.contacts}
          searchContact={this.props.searchContact}
          // searchContactItems={this.props.searchContactItems}
        />
        <ContactsDetails 
          id={this.props.id}
          editContact={this.props.editContact}
          deleteId={this.state.deleteId}
          deleteContact={this.props.deleteContact}
        />
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    contacts: store.contacts.contacts,
    id: store.contacts.id,
    // searchContactItems: store.searchContacts.searchContacts
  }
}

const mapDispatchToProps = (dispatch) => ({
  getContact: () => dispatch(getContact()),
  getprofile: (id) => dispatch(getprofile(id)),
  editContact: (data) => dispatch(editContact(data)),
  deleteContact: (data) => dispatch(deleteContact(data)),
  searchContact: (data) => dispatch(searchContact(data))
})

const ContactsMainContainer = (connect(mapStateToProps, mapDispatchToProps)(ContactsMain))
export { ContactsMainContainer }