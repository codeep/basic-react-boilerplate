import React, { Component } from 'react'
import Select from 'react-select';
import {modal} from '../modals/Modal'

class ContactsDetails extends Component {

  state = {
    atTop: true,
    multi: true,
    multiValue: [],
    options: [
      { value: 'R', label: 'Red' },
      { value: 'G', label: 'Green' },
      { value: 'B', label: 'Blue' },
      { value: 'RV', label: 'Aram' },
      { value: 'GN', label: 'Narek' },
      { value: 'BV', label: 'Vardan' },
      { value: 'RA', label: 'Arman' },
      { value: 'GR', label: 'Grigor' },
      { value: 'BB', label: 'Babken' },
      { value: 'RS', label: 'Samvel' },
      { value: 'GA', label: 'Andranik' },
      { value: 'BG', label: 'Gevorg +37498866626' },
      { value: 'anna', label:  <div><img src="http://prod.mcontrol.com/a_get_contact_photo/64_14991.jpg/" width="24px" height="24px" />  <span>Anna</span></div> }
    ],
    value: undefined,
    types: [
      {
        1: 'Home',
        2: 'Work',
        3: 'Other',
        4: 'Mobile',
        5: 'Unknown'
      }
    ]
  }

  deleteContact = (e) => {
    this.props.deleteContact(this.props.deleteId)
  }

  handleOnChange = (value) => {
		const { multi } = this.state;
		if(multi) {
			this.setState({ multiValue: value })
		} else {
			this.setState({ value })
		}
  }
  
  

  render() {
    const { atTop, multi, multiValue, options, value } = this.state
    const id = this.props.id
    const emails = _.map(id.emails, (value, index) => {
      return (
        <span key={index}>
          <div className="call-log-person-item__inner-block _email-addresses-wrapper">
            <span className="call-log-person-item__tool fs18 _email-address-type">Home</span>
            <span className="call-log-person-item__email fs18 search _email-address-value">{value.email}</span>
            <button className="call-log-letter-btn ver-top-box sprite-b center-center-before pr trans-background letter-icon _send-email" type="button"></button>
            <button type="button" className="person-info-box__tools-star ver-top-box sprite  _is-main"></button>
          </div>
        </span>
      )
    })
    const phones = _.map(id.phones, (value, index) => {
      return (
      <span key={index}>
        <div className="call-log-person-item__inner-block _phone-numbers-wrapper">
          <span className="call-log-person-item__tool fs18 _phone-number-type">Home</span>
          <span className="call-log-person-item__email fs18 search number _phone-number-value">{value.number}</span>
          <button data-toggle="modal" data-target="#phoneId" className="call-log-letter-btn ver-top-box sprite-b center-center-before pr trans-background message-icon _send-sms" type="button"></button>
          <button type="button" className="person-info-box__tools-star ver-top-box sprite  active  _is-main"></button>
        </div>
      </span>
      )
    })
    const addresses = _.map(id.addresses, (value, index) => {
      return (
        <td className="call-log-person-item" key={index}>
          <div className="call-log-person-item__inner-block _addresses-wrapper">
            <span className="call-log-person-item__tool fs18 _email-address-type">Home</span>
            <span className="call-log-person-item__email fs18 search _email-address-value">none</span>
          </div>
        </td>
      )
    })
    return (
    <aside id="_contact-details-wrapper" className="call-log-sidebar clear-fix" data-contact-id="">
      <div className="call-log-sidebar_wrapper">
        <div className="call-log-sidebar_wrapper _contact-view-wrapper">
          {/* HEADER ICONS */}
          <ul id="_contact-details-toolbar" className="message-top-list clear-fix">
            <li className="message-top-list__item fr">
            <button onClick={this.deleteContact}  id="_toolbar-delete" className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before remove-icon" type="button"></button></li>
            <li className="message-top-list__item fr">
            <button id="toolbar-copy" className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before copy-icon" type="button"></button></li>
            <li className="message-top-list__item fr">
            <button id="toolbar-print" className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before print-icon" type="button"></button></li>
            <li className="message-top-list__item fr">
            <button id="toolbar-share" className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before circle-icon" type="button"></button></li>
            <li className="message-top-list__item fr">
            <button className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before letter-icon" type="button"></button></li>
            <li className="message-top-list__item fr">
            <button className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before message-icon" type="button"></button></li>
          </ul>
          {/* LEFT */}
          <div className="call-log-sidebar__main-box scroller-block">
          <div className="call-log-sidebar__wrapper">
          <div className="call-log-person-box call-log-person-box--big pr clear-fix">
          <div className="call-log-person-box__left-box fl tc">
            <div className="call-log-person-box__avatar sprite-b center-center-before"></div>
            <button onClick={this.props.editableContact} className="gray-btn ver-top-box font-bold fs18 hover-active-opacity _contact-edit-btn" type="button">Edit</button>
          </div>
          {/* RIGHT */}
          {modal(<div>
          <div className="col-md-1">
            <label className="form-box__label">To:</label>
            </div>
            <div className="form-box col-md-11">
              <Select.Creatable
                multi={multi}
                options={options}
                onChange={this.handleOnChange}
                value={multi ? multiValue : value}
                showNewOptionAtTop={atTop}
              />
            </div>
            <div className="form-box">
              <textarea className="area" name="sms-text" id="sms-text" cols="30" rows="10" placeholder="Message text"></textarea>
            </div>
          </div>, 'phoneId', 'New sms message')}
          <div className="call-log-person-box__right-box">
          <a className="call-log-person-box__title font-bold fs30 ver-top-box" href="#">{this.props.id.name}</a>
          <p className="call-log-person-box__description fs18 roboto-medium">{this.props.id.company}</p>
          <div className="call-log-person-box__position italic search">{this.props.id.position}</div>
          <table className="call-log-person-info">
            <tbody>
              <tr className="_contact-phone-item-wrapper">
                <td className="call-log-person-item font-bold fs18">Phone number</td>
                <td className="call-log-person-item">
                  {phones}
                </td>
              </tr>
              <tr>
                <td className="call-log-person-item font-bold fs18">Email address</td>
                <td className="call-log-person-item">
                  {emails}
                </td>
              </tr>
              <tr>
                <td className="call-log-person-item font-bold fs18">Address</td>
                {addresses}
              </tr>
              <tr>
                <td className="call-log-person-item font-bold fs18">Notes</td>
                <td className="call-log-person-item">
                  <p className="call-log-person-item__email fs18 tj search _notes"></p>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          </div>
          </div>
          </div>
        </div>
        <div className="call-log-sidebar_wrapper _contact-edit-wrapper dn"></div>
      </div>
    </aside>
    
    )
  }
}

export default ContactsDetails
