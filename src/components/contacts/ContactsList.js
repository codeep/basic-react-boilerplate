import React, { Component } from 'react'
import * as _ from 'lodash'
import ModalAddContact from '../modals/ModalAddContact'
import SelectList from './SelectList'
import Highlighter from "react-highlight-words";


class Contacts extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    tabIndex: 0,
    modalName: 'add-contact-modal',
    searchTerm: '',
    sort: '',
    showSelect: true
  }

  handleSearchContact = (value) => {
    this.setState({ searchTerm: value })
  }

  componentWillMount() {
    this.setState({sort: this.state.sort === 'asc' ? 'desc' : 'asc'})
  }

  selectListToggle = () => {
    this.setState({ showSelect: !this.state.showSelect })
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
    let searchContact  = this.props.contacts;
    searchContact = _.filter(searchContact, (item)=>{
      //get phones and email from array START
      let phones, emails
      _.forEach(item.phones, item => phones = item.number)
      _.forEach(item.emails, item => emails = item.email)
      //END
      return [item.name, item.email, item.company, item.position, phones, emails].some(field => field && _.includes(field.toLocaleLowerCase(), this.state.searchTerm.toLocaleLowerCase()));
    })
    if(this.state.sort !== '') {
      searchContact = _.orderBy(searchContact, 'name', this.state.sort);
    }
    let contactList = _.map(searchContact, (value, index) => {
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
              <div className="accordion-box__title font-bold _name">
                <Highlighter
                  highlightClassName="term-highilght"
                  searchWords={[this.state.searchTerm]}
                  autoEscape={true}
                  textToHighlight={`${value.name}`}
                  className="accordion-box__title font-bold _name"
                />
            </div>
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
      <aside className='list-sidebar calendar-list'>
        <ModalAddContact 
          idName={this.state.modalName}
        />
        {/* SEARCH */}
        <div className='list-search-form__box pr'>
          <input 
          onChange={(e) => this.handleSearchContact(e.target.value)}
          value={this.state.searchTerm}
          id="contact-search" 
          className="list-search-form__text-field list-search-form__large-field" type="text" name="main-search" placeholder="Search/" />
          <input className="list-search-form__btn sprite"/>
          <button  data-toggle="modal" data-target="#add-contact-modal" onClick={this.handleOpenModal} className="add-btn" type="button"></button>
        </div>

        {this.state.showSelect ? <div>
          <div className="record-box record-box--for-contacts pr _list-header">
            <span>Number of contacts: 
              <span id="contact-counter">{this.props.fetch ? searchContact.length : ''}</span>
            </span>
            <div className="record-box__list">
              <a onClick={this.selectListToggle} className="record-box__list-link fr font-bold _switch-select-mode">Select</a>
            </div>
          </div>
          <div 
          className="aaa record-group record-group--for-contacts scroller-block _list-container"
          >
            {this.props.fetch ? contactList : <div style={{display: 'flex',justifyContent:'center'}}>Loading...</div>}
          </div>
        </div> : 
        <SelectList
        selectListToggle={this.selectListToggle}
        />}
        
      </aside>
    )
  }
}

export default Contacts
