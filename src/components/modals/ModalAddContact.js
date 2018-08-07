import React, { Component } from 'react'
import * as _ from 'lodash'
import  addContact  from '../../actions/addContact'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const initialState = {
    phoneNumbers: [],
    emails: [],
    addresses: [
        {
            street: '',
            city: '',
            country: '',
            region: '',
            postcode: '',
            type: 1
        }
    ],
    notes: '',
    name: '',
    company: '',
    position: '',
    showModal: false
  }

class ModalAddContact extends Component {

  state = initialState

  resetData = () => {
    this.setState(initialState);
  }

  removeName = () => {
    this.setState({ name: '' })
  }
  nameChange = (e) => {
    this.setState({ name: e.target.value})
  }
  companyChange = (e) => {
    this.setState({ company: e.target.value})
 }
 positionChange = (e) => {
    this.setState({ position: e.target.value})
 }

  changePhoneName = (index) => (e) => {
    const newPhoneNumbers = this.state.phoneNumbers.map((phItem, phIndex) => {
      if (index !== phIndex) return phItem
      return { ...phItem, number: e.target.value }
    })
    this.setState({ phoneNumbers: newPhoneNumbers })
  }
  changeEmailName = (index) => (e) => {
    const newEmailNumbers = this.state.emails.map((emItem, emIndex) => {
        if (index !== emIndex) return emItem
        return { ...emItem, email: e.target.value }
    })
    this.setState({ emails: newEmailNumbers })
  }
  changeNotes = (e) => {
    this.setState({ notes: e.target.value })
  }



  changePhoneType = (index) => (e) => {
    const newphoneNumbers = this.state.phoneNumbers.map((phItem, phIndex) => {
        if (index !== phIndex) return phItem
        return { ...phItem, type: parseInt(e.target.value) }
    })
    this.setState({ phoneNumbers: newphoneNumbers })
  }
  changeEmailType = (index) => (e) => {
    const newEmailNumbers = this.state.emails.map((emItem, emIndex) => {
        if (index !== emIndex) return emItem
        return { ...emItem, type: parseInt(e.target.value) }
    })
    this.setState({ emails: newEmailNumbers })
  }

  

  addPhone = () => {
    this.setState({ phoneNumbers: this.state.phoneNumbers.concat([{ number: '', type: 1  }]) })
  }
  addEmail = () => {
    this.setState({ emails: this.state.emails.concat([{ email: '', type: 1  }]) })
  }

  
  removePhone = (index) => () => {
    this.setState({ phoneNumbers: this.state.phoneNumbers.filter((s, phIndex) => index !== phIndex) })
  }
  removeEmail = (index) => () => {
    this.setState({ emails: this.state.emails.filter((s, emIndex) => index !== emIndex) })
  }


  removePhoneValue = (index) => (e) => {
    const newphoneNumbers = this.state.phoneNumbers.map((phItem, phIndex) => {
        if (index !== phIndex) return phItem
        return { ...phItem, number: '' }
    })
    this.setState({ phoneNumbers: newphoneNumbers })
  }
  removeEmailValue = (index) => (e) => {
    const newEmailNumbers = this.state.emails.map((emItem, emIndex) => {
        if (index !== emIndex) return emItem
        return { ...emItem, email: '' }
    })
    this.setState({ emails: newEmailNumbers })
  }
  removeNotes = () => {
    this.setState({ notes: '' })
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef =(node)=> {
    this.wrapperRef = node;
  }

  handleClickOutside =() => {
    this.setState({showModal: !this.state.showModal})
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        if(this.state.showModal === true) {
            this.resetData()
        }
      }
  }
  

  send = (e, data) => {
    e.preventDefault()
    data = {
        "name": this.state.name,
        "company": this.state.company,
        "position": this.state.position,
        "notes": this.state.notes,
        "phones": this.state.phoneNumbers,
        "emails": this.state.emails,
        "addresses": []	
    }
    this.props.addContact(data)
    if(this.props.addContactStatus !== 200) {
        toast.success('New contact is created');
        return;
    }
  }
  
  render() {
    let contactList = _.map(this.state.phoneNumbers, (phItem, index) => {
        return (
        <tr key ={index} className = "formset-item phone-number">
            <td>
                <input id="id_phone-create-0-DELETE" name="phone-create-0-DELETE" type="checkbox" value=""/>
                <button
                onClick={this.removePhone(index)}
                className="remove-icon sprite hover-active-opacity _formset-remove-btn" 
                type="button"></button>
            </td>
            <td className="editable-table__select-row">
                <div className="form-box form-box--large-bottom-margin pr">
                    <select
                    onChange={this.changePhoneType(index)}
                    className="_required" 
                    id="id_phone-create-0-type" 
                    name="phone-create-0-type">
                        <option value="1">Домашний</option>
                        <option value="2">Мобильный</option>
                        <option value="3">Рабочий</option>
                        <option value="4">Факс (рабочий)</option>
                        <option value="5">Факс (домашний)</option>
                        <option value="6">Пейджер</option>
                        <option value="7">Другое</option>
                        <option value="8">Callback</option>
                        <option value="9">Car</option>
                        <option value="10">Company main</option>
                        <option value="11">ISDN</option>
                        <option value="12">Основной</option>
                        <option value="13">Факс (другой)</option>
                        <option value="14">Радио</option>
                        <option value="15">Телекс</option>
                        <option value="16">TTY TDD</option>
                        <option value="17">Рабочий мобильный</option>
                        <option value="18">Рабочий мобильный</option>
                        <option value="19">Рабочий пейджер</option>
                        <option value="20">ММС</option>
                    </select>
                </div>
            </td>
            <td className="editable-table__input-row">
                <div className="form-box form-box--large-bottom-margin pr">
                    <input className="_required" id="id_phone-create-0-number" maxLength="45" name="phone-create-0-number"
                    type="text" 
                    placeholder={`Phone number #${index + 1}`}
                    value={phItem.number}
                    onChange={this.changePhoneName(index)}
                    />
                    <button
                    onClick={this.removePhoneValue(index)}
                    className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" 
                    type="button"
                    >
                    </button>
                </div>
            </td>
            <td>
                <button type="button" className="person-info-box__tools-star ver-top-box sprite toggle-className-active"></button>
            </td>
        </tr>
        )
    })
    let emailList = _.map(this.state.emails, (emItem, index) => {
        return (
            <tr key={index} className="formset-item" data-prefix="email-create">
                <td>
                    <input id="id_email-create-0-DELETE" name="email-create-0-DELETE" type="checkbox" value=""/>
                    <button
                    onClick={this.removeEmail(index)}
                    className="remove-icon sprite hover-active-opacity" 
                    type="button"></button>
                </td>
                <td className="editable-table__select-row">
                    <div className="form-box form-box--large-bottom-margin pr">
                        <select
                        onChange={this.changeEmailType(index)}
                        className="_required" 
                        id="id_email-create-0-type" 
                        name="email-create-0-type" 
                        required="">
                            <option value="1">Home</option>
                            <option value="2">Work email</option>
                            <option value="3">Other email</option>
                            <option value="4">Mobile email</option>
                            <option value="999">Unknown</option>
                        </select>
                    </div>
                </td>
                <td className="editable-table__input-row">
                <div className="form-box form-box--large-bottom-margin pr">
                        <input 
                        className="_required" 
                        id="id_email-create-0-email" 
                        maxLength="254" 
                        name="email-create-0-email" 
                        placeholder={`Email number #${index + 1}`}
                        value={emItem.email}
                        onChange={this.changeEmailName(index)}
                        type="email" 
                        required=""/>
                        <button
                        onClick={this.removeEmailValue(index)}
                        className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" 
                        type="button"></button>
                    </div>
                </td>
                <td>
                    <button type="button" className="person-info-box__tools-star ver-top-box sprite toggle-className-active"></button>
                </td>
                <td className="undo dn">
                    <span className="_formset-undo-link" role="link" aria-label="Cancel">Cancel</span>
                </td>
            </tr>
        )
    })
    return(
        <div>
            {/* {this.props.addContactStatus !== 200 ? '' 
            : 
            <div className="notification fs14 tc "  >
            :) Changes to the contact have been saved.
            </div>} */}
           <div id={this.props.idName} className=" modal fade scroller-block" ref={this.setWrapperRef}  role="dialog" >
           <input type="hidden" name="csrfmiddlewaretoken" value="AinvhyweYspyycRHe5TUbdO4M3dJllubn0M7UN3i8alOZTbVazY5MwBrp5o8Z4xW"/>
            <div className="modal-dialog add-modal"> 
                 <div className="modal-content create-contact-popup--content pr"> 
                <div className="list-search-form__autocomplete-box">
                    <h3 className="list-search-form__autocomplete-title fs20">Create contact</h3>
                    <button className="list-search-form__autocomplete-close sprite hover-active-opacity" type="button" onClick={this.resetData} data-toggle="modal" data-target="#add-contact-modal"></button>
                    <form id="_contact-create-form">
                    <div className="call-log-person-box call-log-person-box--big pr clear-fix">
                        <div className="call-log-person-box__left-box fl tc">
                        <input type="file" className="dn choose-image-input" name="contact-avatar" id="contact-avatar"/>
                        <label htmlFor="contact-avatar" className="call-log-person-box__avatar sprite-b center-center-before db tc fs18 call-log-person-box__avatar--edit hover-active-opacity select-none">
                            <span className="call-log-person-box__avatar-text pr">+ <span className="font-bold">Add photo</span></span>
                        </label>
                        </div>
                        <div className="call-log-person-box__right-box create-contact-popup">
                        <div className="form-box form-box--large-bottom-margin">
                            <div className="person-name-box pr">
                                <input className="person-name font-bold fs30" value={this.state.name} onChange={(e) => this.nameChange(e)} id="id_name" maxLength="300" name="name" placeholder="Название" type="text"/>
                            <button onClick={this.removeName} className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" type="button"></button>
                            </div>
                        </div>
                        <table className="call-log-person-info mb-none">
                        <tbody>
                        <tr>
                            <td className="call-log-person-item">
                            <input className="fs18 roboto-medium" id="id_company" maxLength="100" name="company" value={this.state.company} onChange={(e) => this.companyChange(e)} type="text"/>
                            </td>
                        </tr>
                        <tr>
                            <td className="call-log-person-item">
                            <input className="roboto-medium italic" id="id_position" maxLength="100" name="position" value={this.state.position} onChange={(e) => this.positionChange(e)} type="text"/>
                        </td>
                            </tr>
                        </tbody>
                        </table>
                        <table className="call-log-person-info">
                        <tbody>
                            {/* ============================================PHONE=========================================== */}
                            <tr>
                                <td className="call-log-person-item font-bold fs18">Phone number</td>
                                <td className="call-log-person-item">
                                    <table className="editable-table editable-table--inner">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input id="id_phone-create-TOTAL_FORMS" name="phone-create-TOTAL_FORMS" type="hidden" value="1"/>
                                                    <input id="id_phone-create-INITIAL_FORMS" name="phone-create-INITIAL_FORMS" type="hidden" value="0"/>
                                                    <input id="id_phone-create-MIN_NUM_FORMS" name="phone-create-MIN_NUM_FORMS" type="hidden" value="0"/>
                                                    <input id="id_phone-create-MAX_NUM_FORMS" name="phone-create-MAX_NUM_FORMS" type="hidden" value="1000"/>
                                                    <input id="id_phone-create-0-id" name="phone-create-0-id" type="hidden"/>
                                                </td>
                                            </tr>
                                            {/* ======================================================================================= */}
                                            {contactList}
                                            {/* ======================================================================================= */}
                                        </tbody>
                                    </table>
                                    <button 
                                    onClick={(e) => this.addPhone(e)}
                                    id="new-phone-number" 
                                    className="plus-btn sprite-b pr fs18 plus-icon hover-active-opacity _formset-add-btn" 
                                    type="button">Add phone number</button>
                                </td>
                            </tr>
                            {/* ============================================EMAIL=========================================== */}
                            <tr>
                                <td className="call-log-person-item font-bold fs18">Emails</td>
                                <td className="call-log-person-item">
                                    <table className="editable-table editable-table--inner">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input id="id_phone-create-TOTAL_FORMS" name="phone-create-TOTAL_FORMS" type="hidden" value="1"/>
                                                    <input id="id_phone-create-INITIAL_FORMS" name="phone-create-INITIAL_FORMS" type="hidden" value="0"/>
                                                    <input id="id_phone-create-MIN_NUM_FORMS" name="phone-create-MIN_NUM_FORMS" type="hidden" value="0"/>
                                                    <input id="id_phone-create-MAX_NUM_FORMS" name="phone-create-MAX_NUM_FORMS" type="hidden" value="1000"/>
                                                    <input id="id_phone-create-0-id" name="phone-create-0-id" type="hidden"/>
                                                </td>
                                            </tr>
                                            {/* ======================================================================================= */}
                                            {emailList}
                                            {/* ======================================================================================= */}
                                        </tbody>
                                    </table>
                                    <button 
                                    onClick={(e) => this.addEmail(e)}
                                    className="plus-btn sprite-b pr fs18 plus-icon hover-active-opacity _formset-add-btn" 
                                    type="button">Add email</button>
                                </td>
                            </tr>
                            {/* ============================================ADDRESS=========================================== */}
                            <tr>
                                <td className="call-log-person-item font-bold fs18">Address</td>
                                <td className="call-log-person-item">
                                    <table className="editable-table editable-table--inner">
                                    <tbody>
                                    <tr>
                                        <td>
                                        <input id="id_address-create-TOTAL_FORMS" name="address-create-TOTAL_FORMS" type="hidden" value="1"/>
                                        <input id="id_address-create-INITIAL_FORMS" name="address-create-INITIAL_FORMS" type="hidden" value="0"/>
                                        <input id="id_address-create-MIN_NUM_FORMS" name="address-create-MIN_NUM_FORMS" type="hidden" value="0"/>
                                        <input id="id_address-create-MAX_NUM_FORMS" name="address-create-MAX_NUM_FORMS" type="hidden" value="1000"/>
                                        <input id="id_address-create-0-id" name="address-create-0-id" type="hidden"/>
                                        </td>
                                    </tr>
                                        <tr className = "formset-item dn" data-prefix = "address-create">
                                        <td>
                                        <input id="id_address-create-0-DELETE" name="address-create-0-DELETE" type="checkbox" value=""/>
                                        <button className="remove-icon sprite hover-active-opacity _formset-remove-btn" type="button"></button>
                                        </td>
                                        <td className="editable-table__input-row">
                                        <div className="form-box form-box--large-bottom-margin pr">
                                            <table className="editable-table editable-table--inner">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <input id="id_address-create-0-street" maxLength="400" name="address-create-0-street" placeholder="Street" type="text"/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input id="id_address-create-0-city" maxLength="400" name="address-create-0-city" placeholder="City" type="text"/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input id="id_address-create-0-country" maxLength="400" name="address-create-0-country" placeholder="Country" type="text"/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input id="id_address-create-0-region" maxLength="400" name="address-create-0-region" placeholder="Region" type="text"/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input id="id_address-create-0-postcode" maxLength="400" name="address-create-0-postcode" placeholder="Postcode" type="text"/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <select className="_required" id="id_address-create-0-type_id" name="address-create-0-type_id">
                                                            <option value="0">---------</option>
                                                            <option value="01">Custom</option>
                                                            <option value="1" >Home</option>
                                                            <option value="3">Other</option>
                                                            <option value="2">Work</option>
                                                            </select>
                                                        </td>   
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <button className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" type="button"></button>
                                        </div>
                                        </td>
                                        <td className="undo dn">
                                        <span className="_formset-undo-link" role = "link">Cancel</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                    </table>
                                    <button className="plus-btn sprite-b pr fs18 plus-icon hover-active-opacity _formset-add-btn" type="button">Add address</button>
                                </td>
                            </tr>
                            {/* ============================================NOTES=========================================== */}
                            <tr>
                                <td className="call-log-person-item font-bold fs18 vertical-alignment-top">Notes</td>
                                <td className="call-log-person-item">
                                    <table className="editable-table editable-table--longer mb-none">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <button className="remove-icon sprite hover-active-opacity" type="button"></button>
                                            </td>
                                        <td>
                                            <div className="form-box form-box--large-bottom-margin pr">
                                                <textarea
                                                onChange={(e) => this.changeNotes(e)}
                                                value={this.state.notes}
                                                className="fs18 tj notes-textarea" 
                                                cols="40" 
                                                id="id_notes" 
                                                name="notes" 
                                                placeholder="Write your comments here" 
                                                rows="10"/>
                                            <button
                                            onClick={this.removeNotes}
                                            className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" 
                                            type="button"></button>
                                            </div>
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="tr">
                        <button type="button" className="font-bold fs18 btn gray-btn ver-top-box fb hover-active-opacity" onClick={this.resetData} data-dismiss="modal">Cancel</button>
                        <button onClick={(e) =>this.send(e)} className="font-bold fs18 btn blue-btn ver-top-box fb hover-active-opacity" data-dismiss="modal">Create</button>
                    </div>
                    </form>
                    </div>
                 </div> 
                 </div>
            </div>
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
    )}
}

const mapStateToProps = (store) => {
    return {
      contacts: store.contacts.contacts,
      id: store.contacts.id,
      addContactStatus: store.contacts.addContactStatus
    }
  }
  
  const mapDispatchToProps = (dispatch) => ({
    addContact: (phoneData) => dispatch(addContact(phoneData))
  })

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddContact)