import React, { Component } from 'react'

class NotificationsDetails extends Component {

  render() {
    return (
      <aside className='notification-sidebar'>
        <div class="top-right-line clear-fix">
            <div class="top-right-line__person-info fl">
                <div class="accordion-box__title-box accordion-box__title-box--records trans-background pr clear-fix select-none">
                    <div class="accordion-box__avatar sprite-b pr fl">
                        <button class="top-right-icon viber-icon sprite" type="button"></button>
                    </div>
                    <div class="accordion-box__right-box pr">
                        <div class="table">
                            <div class="table-cell">
                                <div class="accordion-box__title font-bold ver-top-box">Anna Kirilenko</div>
                                <i class="ver-top-box">+37455151235</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul class="message-top-list clear-fix">
                <li class="message-top-list__item fr">
                    <button class="message-top-list__button sprite-b center-center-before pr hover-active-opacity-before remove-icon" type="button"></button>
                </li>
            </ul>
        </div>
        <div class="notification-sidebar__wrapper scroller-block">
            <div class="notification-box pr">
                <div class="notification-box__text-box pr ver-top-box">
                    <p class="notification-box__text">It was all a dream, I used to read Word Up magazine Salt'n'Pepa and Heavy D up in the limousine.</p>
                    <button class="notification-box__remove-button sprite-b center-center-before hover-active-opacity-before" type="button"></button>
                    <div class="notification-box__date fs12 tr">22 Oct 2017</div>
                </div>
            </div>
            <div class="notification-box pr">
                <div class="notification-box__text-box pr ver-top-box">
                    <p class="notification-box__text">It was all a dream, I used to read Word Up magazine Salt'n'Pepa and Heavy D up in the limousine.</p>
                    <button class="notification-box__remove-button sprite-b center-center-before hover-active-opacity-before" type="button"></button>
                    <div class="notification-box__date fs12 tr">22 Oct 2017</div>
                </div>
            </div>
            <div class="notification-box pr">
                <div class="notification-box__text-box pr ver-top-box">
                    <p class="notification-box__text">It was all a dream, I used to read Word Up magazine Salt'n'Pepa and Heavy D up in the limousine.</p>
                    <button class="notification-box__remove-button sprite-b center-center-before hover-active-opacity-before" type="button"></button>
                    <div class="notification-box__date fs12 tr">22 Oct 2017</div>
                </div>
            </div>
        </div>
      </aside>
    )
  }
}

export default NotificationsDetails
