import React from "react";
import { Query } from "react-apollo";
import { IS_LOGGED_IN } from "../../graphql/queries";
import { ApolloConsumer } from "react-apollo";
import { Link } from "react-router-dom";
import "./nav.css";
import Modal from "../modal/modal";

class Nav extends React.Component{
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    e.preventDefault();
    this.props.history.push("/home");
  }

  componentWillMount() {
    localStorage.setItem("modal", "")
  }

  setModal(modal) {
    localStorage.setItem("modal", `${modal}`)
    this.forceUpdate()
  }



  render(){
    let modal = localStorage.getItem("modal")
    return (
      <ApolloConsumer>
        {client => (
          <Query query={IS_LOGGED_IN}>
            {({ data }) => {
              if (data.isLoggedIn) {
                return (
                  <div className="nav-container">
                    {modal ? <Modal history={this.props.history} modal={modal} /> : null}
                    <div className="logo container">
                      <Link className="text-link" to="/home"><h1>Bitter</h1></Link>
                      <div className="nav-frog-logo" onClick={this.handleClick}></div>                      
                        <div className="nav-home-logo-wrapper" onClick={this.handleClick}>
                          <div className="nav-home-logo">
                            <i className="fas fa-home nav-home-text"></i>
                            <div className="home-text">Home</div>
                          </div>
                        </div>
                      <button className='tweet-button' onClick={() => this.setModal("create-beet")}>Beet</button>
                    </div>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        localStorage.removeItem("auth-token");
                        localStorage.removeItem("user");
                        client.writeData({ data: { isLoggedIn: false } });
                        this.props.history.push("/");
                      }}
                    >Logout</button>
                    <Link to="/user/5e5d611823fac9a96fefe040"> Tristan </Link>
                    <Link to="/user/5e5d1afa79b5b383df60b4ab"> Guest </Link>
                    <Link to="/user/5e5edb5d9fc066eeecd637ea"> 2Guest2</Link>
                  </div>
                );
              } else {
                return (
                  null
                );
              }
            }}
          </Query>
        )}
      </ApolloConsumer>
    );
  };
}
export default Nav; 