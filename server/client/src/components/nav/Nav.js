import React from "react";
import { Query } from "react-apollo";
import { ApolloConsumer } from "react-apollo";
import { Link } from "react-router-dom";
import "./nav.css";
import Modal from "../modal/modal";
import {currentUser} from "../../util/util";
import { FETCH_USER } from "../../graphql/queries";

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: currentUser() ? currentUser().id : null,
      photoUrl: null
    };
    this.handleFrogLogoOrHomeLogoClick = this.handleFrogLogoOrHomeLogoClick.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleProfileButtonClick = this.handleProfileButtonClick.bind(this);
  }

  componentDidUpdate() {
    if (!this.state.userId && currentUser()) {
      this.setState({
        userId: currentUser().id
      })
    }
  }

  handleFrogLogoOrHomeLogoClick(e) {
    this.props.history.push("/home");
  }

  handleEditButtonClick(e) {
    this.props.history.push(`/editProfile/${this.state.userId}`);
  }

  componentWillMount() {
    localStorage.setItem("modal", "");
  }

  setModal(modal) {
    localStorage.setItem("modal", `${modal}`);;
  }

  handleProfileButtonClick(e) {
    e.preventDefault();
    this.forceUpdate()
    if (this.props.history.location.pathname !== `/user/${this.state.userId}`) {
      this.props.history.push(`/user/${this.state.userId}`);
    }
  }

  render() {
    let modal = localStorage.getItem("modal");
      if (this.state.userId) {
        return (
          <Query query={FETCH_USER} variables={{ id: this.state.userId }}>
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
            return (
          <div className="nav-container">
            {modal ? (
              <Modal history={this.props.history} user={data.user} modal={modal} />
            ) : null}
            <div className="logo container">
              <div
                className="nav-frog-logo"
                onClick={this.handleFrogLogoOrHomeLogoClick}
              ></div>
              <div className="nav-home-logo-wrapper">
                <div
                  className="nav-home-logo"
                  onClick={this.handleFrogLogoOrHomeLogoClick}
                >
                  <i className="fas fa-home nav-home-text"></i>
                  <div className="home-text">Home</div>
                </div>
              </div>
              <div
                className="edit-profile-button"
                onClick={() => { this.setModal("edit-profile") }}
              >
                <i
                  className="fa fa-wrench nav-edit-logo"
                  aria-hidden="true"
                ></i>
                <div className="edit-profile-text">Edit</div>
              </div>
              <div>
                <div className="image-profile-button-wrapper" onClick={this.handleProfileButtonClick}>
                    {data.user.image ? <div className="nav-image" style={{ backgroundImage: `url(${data.user.image})` }}></div> :
                      <div className="nav-image default-profile-picture-modal"></div>}
                    <div className="profile-text">
                      Profile
                    </div>
                </div>
              </div>
                  <ApolloConsumer>
                    {client => (
              <div
                className="logout-button"
                onClick={e => {
                  e.preventDefault();
                  localStorage.removeItem("auth-token");
                  localStorage.removeItem("user");
                  client.writeData({ data: { isLoggedIn: false } });
                  this.props.history.push("/");
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                <div className="logout-button-text">Logout</div>
              </div>
                    )}
                    </ApolloConsumer>
              <button
                className="tweet-button"
                onClick={() => this.setModal("create-beet")}
              >
                Beet
              </button>
            </div>
          </div>
            )}}
          </Query>
        );
      } else {
        return null;
      }
  }
}
export default Nav;