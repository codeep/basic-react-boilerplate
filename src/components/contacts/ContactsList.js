import React, { Component } from 'react'
import * as _ from 'lodash'
import ModalAddContact from '../modals/ModalAddContact'

class Contacts extends Component {
  constructor(props) {
    super(props);
    // this.listRef = React.createRef();
  }

  state = {
    tabIndex: 0,
    modalName: 'add-contact-modal'
  }

  componentDidMount () {
    // this.listRef.current.blur()
    // console.log('did', this.listRef.current)
  }

  getContact = (e, value, index) => {
    this.props.getItem(value)
    this.setState({tabIndex: index})
  }

  onKeyPressed = (e) => {
    if(e.keyCode === 40 && this.state.tabIndex !== this.props.contacts.length) {
      this.setState({tabIndex : this.state.tabIndex + 1})
      let value = this.props.contacts[this.state.tabIndex + 1]
      this.props.getItem(value)
    }
    if(e.keyCode === 38 && this.state.tabIndex !== 0) {
      this.setState({tabIndex : this.state.tabIndex - 1})
      let value = this.props.contacts[this.state.tabIndex - 1]
      this.props.getItem(value)
    }
  }

  render() {
    let contactList = _.map(this.props.contacts, (value, index) => {
    return (
      <span key={index}>
        <div 
        onClick={(e) => this.getContact(e, value, index)}
        tabIndex={this.state.tabIndex}
        onKeyDown={(e) => this.onKeyPressed(e, value, index)}
        className={`${index === this.state.tabIndex ? 'active' : ''} accordion-box__title-box accordion-box__title-box--records trans-background pr clear-fix select-none  _open-contact`}
        >
          <div className="accordion-box__avatar sprite-b pr fl"></div>
          <div className="accordion-box__right-box pr">
          <div className="table">
            <div className="table-cell">
              <div className="accordion-box__title font-bold _name">{value.name}</div>
              <div className="accordion-box__description fs14 _company">{value.company}</div>
              <div className="accordion-box__description fs14 italic _position">{value.position}</div>
            </div>
          </div>
          </div>
        </div>
      </span>
    )
    })
    return (
      <aside className='list-sidebar calendar-list'>
        <ModalAddContact 
          idName={this.state.modalName}
        />
        {/* SEARCH */}
        <div className='list-search-form__box pr'>
          <input id="contact-search" className="list-search-form__text-field list-search-form__large-field" type="text" name="main-search" placeholder="Search/" />
          <input className="list-search-form__btn sprite"/>
          <button  data-toggle="modal" data-target="#add-contact-modal" className="add-btn" type="button"></button>
        </div>
        {/* FILTERS */}
        <div className="record-box record-box--for-contacts pr _list-header">
          <span>Number of contacts: 
            <span id="contact-counter">{this.props.contacts.length}</span>
          </span>
          <div className="record-box__list">
            <a href="#" className="record-box__list-link fr font-bold _switch-select-mode">Select</a>
          </div>
        </div>
        {/* LIST */}
        <div 
        // ref={this.listRef} 
        className="aaa record-group record-group--for-contacts scroller-block _list-container"
        >
          {contactList}
        </div>
      </aside>
    )
  }
}

export default Contacts
