import React, { Component } from 'react'
import ContactsList from '../../components/contacts/ContactsList'
import ContactsDetails from '../../components/contacts/ContactsDetails'
import ContactsEdit from '../../components/contacts/ContactsEdit'
import getContact, {getprofile} from '../../actions/contactsActions'
import editContact from '../../actions/editContact'
import deleteContact from '../../actions/deleteContact'
import searchContact from '../../actions/searchContact'
import { connect } from 'react-redux'

class ContactsMain extends Component {

  state = {
    deleteId: '',
    editable: false,
    showDetailComponent: false
  }

  componentDidMount () {
    this.props.getContact()
  }

  getItem = (contact) => {
    this.props.history.push(`/contacts/profile?id=${contact.serverId}`)
    this.setState({ deleteId: contact.serverIde, editable: false, showDetailComponent: true})
    this.props.getprofile(contact.serverId)
  }

  editableContact = () => {
    this.setState({ editable: true })
  }

  cancelEdit = (bool) => {
    this.setState({editable: bool})
  }

  render() {
    return (
      <div>
        <ContactsList 
          getItem={this.getItem}
          contacts={this.props.contacts}
          searchContact={this.props.searchContact}
        />
        {
          !this.state.editable
          ?
          ( this.state.showDetailComponent && <ContactsDetails 
            id={this.props.id}
            editContact={this.props.editContact}
            deleteId={this.state.deleteId}
            deleteContact={this.props.deleteContact}
            editableContact={this.editableContact}
          /> )
          :
          <ContactsEdit
          cancelEdit={this.cancelEdit}
          id={this.props.id}
          editContact={this.props.editContact}
          types={this.props.types}
          />
        }
        
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  console.log('store', store)
  return {
    contacts: store.contacts.contacts,
    id: store.contacts.id,
    types: store.contacts.types
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