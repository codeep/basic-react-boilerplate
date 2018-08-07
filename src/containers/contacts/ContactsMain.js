import React, { Component } from 'react'
import ContactsList from '../../components/contacts/ContactsList'
import ContactsDetails from '../../components/contacts/ContactsDetails'
import ContactsEdit from '../../components/contacts/ContactsEdit'
import getContact from '../../actions/contactsActions'
import editContact from '../../actions/editContact'
import deleteContact from '../../actions/deleteContact'
import searchContact from '../../actions/searchContact'
import typesAction from '../../actions/typesAction'
import mainPhoneStar from '../../actions/mainStarActions'
import { connect } from 'react-redux'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class ContactsMain extends Component {

  state = {
    deleteId: '',
    editable: false,
    showDetailComponent: false,
    contactDetail: [],
    showToaster: false,
  }

  componentDidMount () {
    this.props.getContact()
  }

  getItem = (contact) => {
    this.props.history.push(`/contacts/profile?id=${contact.id}`)
    this.setState({ deleteId: contact.id, editable: false, showDetailComponent: true, contactDetail: contact, showToaster: false})
    // this.props.getprofile(contact.id)
  }

  //get new stars
  getPhones = (data) => {
    this.setState({
      contactDetail: {...this.state.contactDetail, phones: data
    }})
  }

  editableContact = () => {
    this.setState({ editable: true })
  }

  cancelEdit = (bool) => {
    this.setState({editable: bool})
  }

  toasterShow = (bool) => {
    this.setState({ showToaster: bool})
  }

  componentDidUpdate() {
    if(this.state.showToaster === true) {
      toast.success('Contact has been saved');
      this.setState({ showToaster: false})
      return;
    }
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
            types={this.props.types}
            typesAction={this.props.typesAction}
            showToaster={this.state.showToaster}
            toasterShow={this.toasterShow}
            mainPhoneStar={this.props.mainPhoneStar}
            getPhones={this.getPhones}
          /> )
          :
          <ContactsEdit
            getItem={this.getItem}
            cancelEdit={this.cancelEdit}
            id={this.state.contactDetail}
            editContact={this.props.editContact}
            types={this.props.types}
            typesAction={this.props.typesAction}
            toasterShow={this.toasterShow}
          />
        }
        <ToastContainer
          position="top-right"
          type="success"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    contacts: store.contacts.contacts,
    // id: store.contacts.id,
    types: store.types.types,
    fetch: store.contacts.fetch
  }
}

const mapDispatchToProps = (dispatch) => ({
  getContact: () => dispatch(getContact()),
  // getprofile: (id) => dispatch(getprofile(id)),
  editContact: (data) => dispatch(editContact(data)),
  deleteContact: (data) => dispatch(deleteContact(data)),
  searchContact: (data) => dispatch(searchContact(data)),
  typesAction: () => dispatch(typesAction()),
  mainPhoneStar: (phoneStar) => dispatch(mainPhoneStar(phoneStar))
})

const ContactsMainContainer = (connect(mapStateToProps, mapDispatchToProps)(ContactsMain))
export { ContactsMainContainer }