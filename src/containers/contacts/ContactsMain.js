import React, { Component } from 'react'
import ContactsList from '../../components/contacts/ContactsList'
import ContactsDetails from '../../components/contacts/ContactsDetails'
import ContactsEdit from '../../components/contacts/ContactsEdit'
import getContact, {getprofile} from '../../actions/contactsActions'
import editContact from '../../actions/editContact'
import deleteContact from '../../actions/deleteContact'
import searchContact from '../../actions/searchContact'
import typesAction from '../../actions/typesAction'
import { connect } from 'react-redux'

class ContactsMain extends Component {

  state = {
    deleteId: '',
    editable: false,
    showDetailComponent: false,
    contactDetail: []
  }

  componentDidMount () {
    this.props.getContact()
  }

  getItem = (contact) => {
    this.props.history.push(`/contacts/profile?id=${contact.id}`)
    this.setState({ deleteId: contact.serverId, editable: false, showDetailComponent: true, contactDetail: contact})
    // this.props.getprofile(contact.id)
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
          fetch={this.props.fetch}
        />
        {
          !this.state.editable
          ?
          ( this.state.showDetailComponent && <ContactsDetails 
            id={this.state.contactDetail}
            editContact={this.props.editContact}
            deleteId={this.state.deleteId}
            deleteContact={this.props.deleteContact}
            editableContact={this.editableContact}
          /> )
          :
          <ContactsEdit
          cancelEdit={this.cancelEdit}
          id={this.state.contactDetail}
          editContact={this.props.editContact}
          types={this.props.types}
          typesAction={this.props.typesAction}
          />
        }
        
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    contacts: store.contacts.contacts,
    id: store.contacts.id,
    types: store.types.types,
    fetch: store.contacts.fetch
  }
}

const mapDispatchToProps = (dispatch) => ({
  getContact: () => dispatch(getContact()),
  getprofile: (id) => dispatch(getprofile(id)),
  editContact: (data) => dispatch(editContact(data)),
  deleteContact: (data) => dispatch(deleteContact(data)),
  searchContact: (data) => dispatch(searchContact(data)),
  typesAction: () => dispatch(typesAction())
})

const ContactsMainContainer = (connect(mapStateToProps, mapDispatchToProps)(ContactsMain))
export { ContactsMainContainer }