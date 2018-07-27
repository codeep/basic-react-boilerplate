import React, { Component } from 'react'

class ContactsEdit extends Component {
    state = {
        phone_changes: this.props.id.phones,
        deleted: [

        ],
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
        notes: this.props.id.notes,
        cancleEdit: false,
        name: this.props.id.name,
        company: this.props.id.company,
        position: this.props.id.position
      }
      
    nameChange = (e) => {
        this.setState({ name: e.target.value})
    }
    removeName = () => {
        this.setState({ name: '' })
    }
    companyChange = (e) => {
        this.setState({ company: e.target.value})
    }
    positionChange = (e) => {
        this.setState({ position: e.target.value})
    }
    
    
    changePhoneName = (index) => (e) => {
        const newPhoneNumbers = this.state.phone_changes.map((phItem, phIndex) => {
        if (index !== phIndex) return phItem
        return { ...phItem, number: e.target.value }
    })
        this.setState({ phone_changes: newPhoneNumbers })
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
        const newphoneNumbers = this.state.phone_changes.map((phItem, phIndex) => {
        if (index !== phIndex) return phItem
        return { ...phItem, typeId: parseInt(e.target.value) }
    })
        this.setState({ phone_changes: newphoneNumbers })
    }
    changeEmailType = (index) => (e) => {
        const newEmailNumbers = this.state.emails.map((emItem, emIndex) => {
        if (index !== emIndex) return emItem
        return { ...emItem, typeId: parseInt(e.target.value) }
    })
        this.setState({ emails: newEmailNumbers })
    }

    saveEdit = (e, data) => {
        e.preventDefault()
        data = {
            "id": this.props.id.id,
            "name": this.state.name,
            "phone_changes": this.state.phone_changes,
            "company": this.state.company,
            "position": this.state.position,
            "email_changes":this.state.emails,
            "addresses": [],
            "notes": this.state.notes
        }
        if(this.state.deleted.length !== 0) {
            this.state.phone_changes.push(this.state.deleted)
        }
        this.props.editContact(data)
    }


    addPhone = () => {
        this.setState({ phone_changes: this.state.phone_changes.concat([{ number: '', typeId: 1  }]) })
    }
    addEmail = () => {
        this.setState({ emails: this.state.emails.concat([{ email: '', typeId: 1  }]) })
    }

    
    removePhone = (index) => () => {
        this.setState({ phone_changes: this.state.phone_changes.filter((s, phIndex) => index !== phIndex) })
        _.forEach(this.state.phone_changes, (value, phIndex) => {
            if(phIndex === index && value.id) {
                let removeId = {"delete": 1}
                let deleted = Object.assign(value, removeId)
                this.setState({ deleted: deleted })
            }
        })
    }
    removeEmail = (index) => () => {
        this.setState({ emails: this.state.emails.filter((s, emIndex) => index !== emIndex) })
    }

    removePhoneValue = (index) => (e) => {
        const newphoneNumbers = this.state.phone_changes.map((phItem, phIndex) => {
        if (index !== phIndex) return phItem
        return { ...phItem, number: '' }
    })
        this.setState({ phone_changes: newphoneNumbers })
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

    cancelEdit = () => {
        this.setState({cancleEdit: true}, this.props.cancelEdit(this.state.cancleEdit))
    }

  render() {
    let phoneTypes = _.map(this.props.types.phoneTypes, (item, index) => {
        return (
            <option key={index} value={item.id}>{item.name}</option>
        )
    })
    let emailTypes = _.map(this.props.types.emailTypes, (item, index) => {
        return (
            <option key={index} value={item.id}>{item.name}</option>
        )
    })
    let contactList = _.map(this.state.phone_changes, (phItem, index) => {
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
                    {phoneTypes}
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
                        {emailTypes}
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
    return (
        <aside id="_contact-details-wrapper" className="call-log-sidebar clear-fix" data-contact-id="">
          <ul className="message-top-list clear-fix">
            <li className="message-top-list__item fr">
                <button className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before remove-icon" type="button"></button>
            </li>
        </ul>     
        <div className="call-log-sidebar__main-box scroller-block">
            <div className="call-log-sidebar__wrapper">
            <form id="_contact-create-form">
                    <div className="call-log-person-box call-log-person-box--big pr clear-fix">
                        <div className="call-log-person-box__left-box fl tc">
                        <input type="file" className="dn choose-image-input" name="contact-avatar" id="contact-avatar"/>
                        <label htmlFor="contact-avatar" className="call-log-person-box__avatar sprite-b center-center-before db tc fs18 call-log-person-box__avatar--edit hover-active-opacity select-none">
                            <span className="call-log-person-box__avatar-text pr">+ <span className="font-bold">Add photo</span></span>
                        </label>
                        <div className="edit-btn-container">
                            <button onClick={this.saveEdit} className="blue-btn ver-top-box font-bold fs18 hover-active-opacity" type="submit">Save</button>
                        </div>
                        <div className="edit-btn-container">
                            <button onClick={this.cancelEdit} className="cancel-btn ver-top-box font-bold fs18 hover-active-opacity" type="button">Cancel</button>
                        </div>
                        </div>
                        <div className="call-log-person-box__right-box create-contact-popup">
                        <div className="form-box form-box--large-bottom-margin">
                            <div className="person-name-box pr">
                                <input className="person-name font-bold fs30" id="id_name" maxLength="300" name="name" value={this.state.name} onChange={(e) => this.nameChange(e)}  type="text"/>
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
                                                placeholder={this.state.notes} 
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
                </form>
            </div>
        </div>
      </aside>
    )
  }
}

export default ContactsEdit
