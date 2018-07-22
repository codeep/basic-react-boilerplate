import React, { Component } from 'react'
import * as _ from 'lodash'

class NotificationsList extends Component {

    state = {
        fakeData: [
            {
                'company': "AA",
                'externalId': 685,
                'name':"Aram",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"student",
                'serverId': 1042186
            },
            {
                'company': "BB",
                'externalId': 454,
                'name':"Vardan",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"developer",
                'serverId': 1042186
            },
            {
                'company': "CC",
                'externalId': 232,
                'name':"Gexam",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"student",
                'serverId': 1042186
            },
            {
                'company': "DD",
                'externalId': 677,
                'name':"Levon",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"developer",
                'serverId': 1042186
            },
            {
                'company': "FF",
                'externalId': 245,
                'name':"Tigran",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"student",
                'serverId': 1042186
            },
            {
                'company': "KK",
                'externalId': 789,
                'name':"Mariam",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"developer",
                'serverId': 1042186
            },
            {
                'company': "OO",
                'externalId': 445,
                'name':"Nune",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"student",
                'serverId': 1042186
            },
            {
                'company': "LL",
                'externalId': 345,
                'name':"Lusine",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"developer",
                'serverId': 1042186
            },
            {
                'company': "II",
                'externalId': 234,
                'name':"Karine",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"student",
                'serverId': 1042186
            },
            {
                'company': "UU",
                'externalId': 645,
                'name':"Arsen",
                'notes':null,
                'photoName':"64_14991.jpg",
                'position':"developer",
                'serverId': 1042186
            },
        ]
    }

  render() {
    let notificationsList = _.map(this.state.fakeData, (value, index) => {
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
      <aside className='list-sidebar list-sidebar--info calendar-list'>
        {/* SEARCH */}
        <div className='list-search-form__box pr'>
          <input id="contact-search" className="list-search-form__text-field list-search-form__large-field" type="text" name="main-search" placeholder="Search/" />
          <input className="list-search-form__btn sprite"/>
          <button  data-toggle="modal" data-target="#creacteContact" className="add-btn" type="button"></button>
        </div>
        {/* FILTERS */}
        <div className="record-box record-box--for-contacts pr _list-header">
          <span>Number of notifications: 
            <span id="contact-counter">40</span>
          </span>
          <div className="record-box__list">
            <a href="#" className="record-box__list-link fr font-bold _switch-select-mode">Select</a>
          </div>
        </div>
        {/* LIST */}
        <div className="aaa record-group record-group--for-contacts scroller-block _list-container">
          {notificationsList}
        </div>
      </aside>
    )
  }
}

export default NotificationsList
