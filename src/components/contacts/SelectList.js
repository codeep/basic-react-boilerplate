import React, { Component } from "react"

class Selectlist extends Component {
  state = {
    list: [
      {
        id: 1,
        name: "Aram",
        company: "intel",
        position: "react developer"
      },
      {
        id: 2,
        name: "Vardan",
        company: "facebook",
        position: "designer"
      },
      {
        id: 3,
        name: "Grigor",
        company: "google",
        position: "backend developer"
      },
      {
        id: 4,
        name: "Anna",
        company: "microsoft",
        position: "angular developer"
      }
    ],
    selectedIds: []
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

  render() {
    // console.log('===selectedIds===', this.state.selectedIds)
    let selectList = this.state.list.map((value, index) => {
      return (
        <div
          key={index}
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
          <div className="accordion-box__right-box pr">
            <div className="table">
              <div className="table-cell">
                <div className="accordion-box__title font-bold _name">
                  {value.name}
                </div>
                <div className="accordion-box__description fs14 _company">
                  {value.company}
                </div>
                <div className="accordion-box__description fs14 italic _position">
                  {value.position}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
    return (
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
        </div>
      </div>
    )
  }
}

export default Selectlist
