import React, { Component } from 'react'
import * as _ from 'lodash'
import  addContact  from '../../actions/addContact'
import { connect } from 'react-redux'

class ModalAddContact extends Component {

  state = {
    phoneNumbers: [
        { number: '',type : 1 }
    ]
  }
  
  changeName = (index) => (e) => {
    const newphoneNumbers = this.state.phoneNumbers.map((phItem, phIndex) => {
      if (index !== phIndex) return phItem
      return { ...phItem, number: e.target.value }
    })
    this.setState({ phoneNumbers: newphoneNumbers })
  }

  changeType = (index) => (e) => {
    const newphoneNumbers = this.state.phoneNumbers.map((phItem, phIndex) => {
        if (index !== phIndex) return phItem
        return { ...phItem, type: parseInt(e.target.value) }
    })
    this.setState({ phoneNumbers: newphoneNumbers })
  }
  
  addPhone = () => {
    this.setState({ phoneNumbers: this.state.phoneNumbers.concat([{ number: '', type: 1  }]) })
  }
  
  removePhone = (index) => () => {
    this.setState({ phoneNumbers: this.state.phoneNumbers.filter((s, phIndex) => index !== phIndex) })
  }

  send = (e, data) => {
    e.preventDefault()
    data = this.state.phoneNumbers
    this.props.addContact(data)
  }

render() {
    console.log('STATE', this.state)
    let contactList = _.map(this.state.phoneNumbers, (phItem, index) => {
        return (
        <tr key ={index} className = "formset-item phone-number" data-prefix = "email-create">
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
                onChange={this.changeType(index)}
                className="_required" 
                id="id_phone-create-0-type" 
                name="phone-create-0-type">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                </div>
            </td>
            <td className="editable-table__input-row">
                <div className="form-box form-box--large-bottom-margin pr">
                    <input className="_required" id="id_phone-create-0-number" maxLength="45" name="phone-create-0-number"
                    type="text" 
                    placeholder={`Phone number #${index + 1}`}
                    value={phItem.number}
                    onChange={this.changeName(index)}
                    />
                    <button
                    className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" 
                    type="button"
                    >
                    </button>
                </div>
            </td>
            <td>
                <button type="button" className="person-info-box__tools-star ver-top-box sprite toggle-className-active"></button>
            </td>
            <td className="undo dn">
                <span className="_formset-undo-link" role = "link" aria-label="Cancel">Cancel</span>
            </td>
        </tr>
        )
    })
    return(
        <div id={this.props.idName} className="modal fade scroller-block" data-caller role="dialog"  >
            <input type="hidden" name="csrfmiddlewaretoken" value="AinvhyweYspyycRHe5TUbdO4M3dJllubn0M7UN3i8alOZTbVazY5MwBrp5o8Z4xW"/>
            <div className="modal-dialog add-modal">
                <div className="modal-content create-contact-popup--content pr">
                <div className="list-search-form__autocomplete-box">
                    <h3 className="list-search-form__autocomplete-title fs20">Create contact</h3>
                    <button className="list-search-form__autocomplete-close sprite hover-active-opacity" type="button" data-toggle="modal" data-target="#add-contact-modal"></button>
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
                                <input className="person-name font-bold fs30" id="id_name" maxLength="300" name="name" placeholder="Название" type="text"/>
                            <button className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" type="button"></button>
                            </div>
                        </div>
                        <table className="call-log-person-info mb-none">
                        <tbody>
                        <tr>
                            <td className="call-log-person-item">
                            <input className="fs18 roboto-medium" id="id_company" maxLength="100" name="company" placeholder="организация" type="text"/>
                            </td>
                        </tr>
                        <tr>
                            <td className="call-log-person-item">
                            <input className="roboto-medium italic" id="id_position" maxLength="100" name="position" placeholder="должность" type="text"/>
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
                                        <tr className = 'formset-item dn' data-prefix = 'email-create'>
                                        <td>
                                            <input id="id_email-create-0-DELETE" name="email-create-0-DELETE" type="checkbox" value=""/>
                                            <button className="remove-icon sprite hover-active-opacity" type="button"></button>
                                        </td>
                                        <td className="editable-table__select-row">
                                            <div className="form-box form-box--large-bottom-margin pr">
                                            <select className="_required" id="id_email-create-0-type" name="email-create-0-type" required="">
                                                <option value="1"  >Домашний</option>
                                                <option value="2">Рабочий</option>
                                                <option value="3">Другое</option>
                                                <option value="4">Мобильный</option>
                                                <option value="999">Неизвестный тип</option>
                                            </select>
                                            </div>
                                        </td>
                                        <td className="editable-table__input-row">
                                            <div className="form-box form-box--large-bottom-margin pr">
                                            <input className="_required" id="id_email-create-0-email" maxLength="254" name="email-create-0-email" placeholder="Email" type="email" required=""/>
                                            <button className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" type="button"></button>
                                            </div>
                                        </td>
                                        <td>
                                            <button type="button" className="person-info-box__tools-star ver-top-box sprite toggle-className-active"></button>
                                        </td>
                                        <td className="undo dn">
                                            <span className="_formset-undo-link" role = "link" >Cancel</span>
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                    <button className="plus-btn sprite-b pr fs18 plus-icon hover-active-opacity _formset-add-btn" type="button">Add email</button>
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
                                                <textarea className="fs18 tj notes-textarea" cols="40" id="id_notes" name="notes" placeholder="Write your comments here" rows="10"></textarea>
                                            <button className="remove-value remove-value--gray sprite delete-input-text hover-active-opacity" type="button"></button>
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
                        <button type="button" className="font-bold fs18 btn gray-btn ver-top-box fb hover-active-opacity" data-dismiss="modal">Cancel</button>
                        <button onClick={(e) =>this.send(e)} className="font-bold fs18 btn blue-btn ver-top-box fb hover-active-opacity">Create</button>
                    </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )}
}

const mapStateToProps = (store) => {
    return {
      contacts: store.contacts.contacts,
      id: store.contacts.id
    }
  }
  
  const mapDispatchToProps = (dispatch) => ({
    addContact: (phoneData) => dispatch(addContact(phoneData))
  })

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddContact)
