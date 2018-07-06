import React from 'react';
import profile from "../static/img/user_profile/Vladimir_Putin_12023.png";

export const Header = () => {
  return(
    <aside className="top-sidebar">
      <form className="search-form" action="#" method="post">
          <div className="search-form__box pr">
              <input className="search-form__text-field" type="text" name="main-search" placeholder="Search" />
              <input className="search-form__btn sprite" type="submit" value="" />
          </div>
      </form>

      <div className="user-profile-box pr user-profile-box--with-img">
          <img src={profile} alt="Image alternative description" />

          <div className="user-profile-box__info-box clear-fix _autoclose dn">
              <div className="user-profile-box__avatar-box fl">
                <div className="user-profile-box__avatar fs54 tc tu pr">J</div>
              </div>
              <div className="user-profile-box__right-box">
                <h3 className="user-profile-box__title font-bold fs18">John Smith</h3>
                <p className="user-profile-box__sub-title">
                  <a className="user-profile-box__sub-title-link roboto-medium" href="#"></a>
                </p>
                <div className="user-profile-box__text-box">
                  <p className="user-profile-box__text">1</p>
                </div>
                <a className="blue-btn ver-top-box fs18 font-bold hover-active-opacity" href="/settings/">Settings</a>
                <a id="log-out-btn" className="blue-btn ver-top-box fs18 font-bold hover-active-opacity" href="/h_log_out/">Log out</a>
              </div>
          </div>
      </div>
    </aside>
  )
}
