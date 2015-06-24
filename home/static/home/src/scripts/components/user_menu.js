var UserMenu = React.createClass({

  loadSelfInfo: function() {
    $.ajax({
      url: '/api/users/myself',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({myself: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      myself: []
    };
  },

  render: function() {
    return this.state.myself.length === [] ?
      <ul></ul> :
      <ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown">
            {this.state.myself.name} <span className="caret"></span>
          </a>
          <ul className="dropdown-menu" role="menu">
            <li><a href="/signout/">サインアウト</a></li>
          </ul>
        </li>
      </ul>
  },

  componentDidMount: function() {
    this.loadSelfInfo();
  }

});

module.exports = UserMenu;
