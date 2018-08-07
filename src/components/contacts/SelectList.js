import React, { Component } from "react"
import * as _ from 'lodash'
import Highlighter from "react-highlight-words";

class Selectlist extends Component {
  state = {
    tabIndex: 0,
    list: this.props.contacts,
    selectedIds: [],
    searchTerm: '',
    sort: ''
  }

  componentWillMount() {
    this.setState({sort: this.state.sort === 'asc' ? 'desc' : 'asc'})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({searchTerm: nextProps.searchTerm})
  }

  handleSearchContact = (value) => {
    this.setState({ searchTerm: value })
  }

  allSelected = state => {
    for (let item of state.list) {
      if (!state.selectedIds.includes(item.id)) {
        return false
      }
    }
    return true
  }

  toggleContact = (id, value) => {
    // console.log("toggleContact", id, value)
    this.setState(prevState => {
      if (prevState.selectedIds.includes(id)) {
        return {
          selectedIds: prevState.selectedIds.filter(otherId => otherId !== id)
        }
      }
      return {
        selectedIds: [...prevState.selectedIds, id]
      }
    })
  }

  toggleSelectAllContacts = () => {
    // console.log("toggleSelectAllContacts")
    this.setState(prevState => {
      if (this.allSelected(prevState)) {
        return {
          selectedIds: []
        }
      }
      return {
        selectedIds: prevState.list.map(item => item.id)
      }
    })
  }

  getContact = (e, value, index) => {
    this.props.getItem(value)
    this.setState({tabIndex: index})
  }

  onKeyPressed = (e) => {
    let searchContact  = this.props.contacts; 
    if(this.state.sort !== '') {
      searchContact = _.orderBy(searchContact, 'name', this.state.sort);
    }
    if(e.keyCode === 40 && this.state.tabIndex !== (this.props.contacts.length - 1)) {  
      this.setState({tabIndex : this.state.tabIndex + 1}, () => {
        let value = searchContact[this.state.tabIndex]
        this.props.getItem(value)
      })
    }
    if(e.keyCode === 38 && this.state.tabIndex !== 0) {
      this.setState({tabIndex : this.state.tabIndex - 1}, () => {
        let value = searchContact[this.state.tabIndex]
        this.props.getItem(value)
      })
    }
  }

  render() {
    let searchContact  = this.props.contacts
    searchContact = _.filter(searchContact, (item)=>{
      //get phones and email from array START
      let phones, emails
      _.forEach(item.phones, item => phones = item.number)
      _.forEach(item.emails, item => emails = item.email)
      //END
      return [item.name, item.email, item.company, item.position, phones, emails].some(field => field && _.includes(field.toLocaleLowerCase(), this.state.searchTerm.toLocaleLowerCase()));
    })
    if(this.state.sort !== '') {
      searchContact = _.orderBy(searchContact, 'name', this.state.sort)
    }
    let selectList = searchContact.map((value, index) => {
      return (
        <span key={index}>
          <div
          
          className={`${this.state.selectedIds.includes(value.id) ? "selected-contact" : ""} accordion-box__title-box accordion-box__title-box--records trans-background pr clear-fix select-none _open-contact accordion-box__title-box--for-checkbox`}
          >
            <form className="choose-form checkbox-form">
              <div className="choose-form__box tc">
              <input
                  checked={this.state.selectedIds.includes(value.id)}
                  onChange={e => this.toggleContact(value.id, value)}
                  type="checkbox"
                  name={`checkbox_contact_${value.id}`}
                  id={`checkbox_contact_${value.id}`}
                />
                <label
                  htmlFor={`checkbox_contact_${value.id}`}
                  className="choose-form__attach-file ver-top-box sprite pr hover-active-opacity sprite-b center-center-before"
                />
              </div>
            </form>
            <div className="accordion-box__avatar sprite-b pr fl" />
            <div 
            onClick={(e) => this.getContact(e, value, index)}
            tabIndex={this.state.tabIndex}
            onKeyDown={(e) => this.onKeyPressed(e, value, index)}
            className="accordion-box__right-box pr">
              <div className="table">
                <div className="table-cell">
                  {value.name && <div className="accordion-box__title font-bold _name">
                  <Highlighter
                    highlightClassName="term-highilght"
                    searchWords={[this.state.searchTerm]}
                    autoEscape={true}
                    textToHighlight={`${value.name}`}
                    className="accordion-box__title font-bold _name"
                  />
                  </div>}
                  {value.company && <div className="accordion-box__description fs14 _company">
                  <Highlighter
                    highlightClassName="term-highilght"
                    searchWords={[this.state.searchTerm]}
                    autoEscape={true}
                    textToHighlight={`${value.company}`}
                    className="accordion-box__title _name"
                  />
                  </div>}
                  {value.position && <div className="accordion-box__description fs14 italic _position">
                  <Highlighter
                    highlightClassName="term-highilght"
                    searchWords={[this.state.searchTerm]}
                    autoEscape={true}
                    textToHighlight={`${value.position}`}
                    className="accordion-box__title _name"
                  />
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </span>
      )
    })
    return (
      <div>
        <div className="parrent-select">
          <div className="record-box record-box--for-contacts pr _list-header">
            <form className="choose-form ver-top-box">
              <div className="choose-form__box tc">
                <input
                  checked={this.allSelected(this.state)}
                  onChange={this.toggleSelectAllContacts}
                  type="checkbox"
                  id="contact-select-all"
                  name="contact-select-all"
                />
                <label
                  className="choose-form__attach-file ver-top-box sprite pr hover-active-opacity sprite-b center-center-before"
                  htmlFor="contact-select-all"
                />
              </div>
            </form>
            <ul className="message-top-list ver-top-box _list-toolbar clear-fix">
              <li className="message-top-list__item fl">
                <button
                  id="contact-list-toolbar-send-sms"
                  className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before message-icon"
                  type="button"
                />
              </li>
              <li className="message-top-list__item fl">
                <button
                  id="contact-list-toolbar-send-email"
                  className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before letter-icon"
                  type="button"
                />
              </li>
              <li className="message-top-list__item fl">
                <button
                  id="contact-list-toolbar-share"
                  className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before circle-icon"
                  type="button"
                />
              </li>
              <li className="message-top-list__item fl">
                <button
                  id="contact-list-toolbar-print"
                  className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before print-icon"
                  type="button"
                />
              </li>
              <li className="message-top-list__item fl">
                <button
                  id="contact-list-toolbar-copy"
                  className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before copy-icon"
                  type="button"
                />
              </li>
              <li className="message-top-list__item fl">
                <button
                  id="contact-list-toolbar-delete"
                  className="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before remove-icon"
                  type="button"
                />
              </li>
            </ul>
            <div className="record-box__list">
              <a
                onClick={this.props.selectListToggle}
                className="record-box__list-link fr font-bold _cancel-mode"
              >
                Cancel
              </a>
            </div>
          </div>
          <div
            id="contact-list-container"
            className="record-group record-group--for-contacts scroller-block"
          >
            {selectList}
          {
          this.state.selectedIds.length !== 0 
          &&
          <div className="select-list-counter">
            <p>{this.state.selectedIds.length} contact(s) selected</p>
          </div>
          }
          </div>
        </div>
      </div>
    )
  }
}

export default Selectlist
