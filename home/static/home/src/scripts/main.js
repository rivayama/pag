/** @jsx React.DOM */
'use strict';

var React = require('react');
var ButtonInput = require('react-bootstrap').ButtonInput;

// {{{ Randing page
var RandingPage = React.createClass({
  render: function() {
    return (
      <div className="site-wrapper-inner">
        <div className="cover-container">

          <div className="masthead clearfix">
            <div className="inner">
              <h3 className="masthead-brand">PAG</h3>
            </div>
          </div>

          <div className="inner cover">
            <h1 className="cover-heading">Project Auto Grader</h1>
            <p className="lead">Backlogのスペース名を入力してください。認証後、プロジェクトの採点が始まります。</p>
            <p className="lead">
              <form action="/auth/" method="post" className="form-inline">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon">http://</div>
                    <input type="text" name="space" className="form-control input-lg" id="exampleInputAmount" placeholder="Space name"/>
                    <div className="input-group-addon">.backlog.jp</div>
                  </div>
                </div>
                <ButtonInput type="submit" value="Grade Your Project" bsSize="large" />
              </form>
            </p>
          </div>

          <div className="mastfoot">
            <div className="inner">
              <p>2015 Koyama PBL / AIIT</p>
            </div>
          </div>

        </div>
       </div>
    );
  }
});
// }}}

// {{{ Grader
var Grader = React.createClass({

  getInitialState: function() {
    return {
      isLoading: false,
      grade: []
    };
  },

  loadGrade: function(i) {
    // Activate project
    this.props.data.map(function(project, i){
      project.active = false;
    });
    this.props.data[i].active = true;
    this.setState({isLoading: true, grade: []});

    $.ajax({
      url: '/api/grade/' + this.props.data[i].id,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.length > 0) {
          this.setState({isLoading: false, grade: data});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    if (! this.state.isLoading) {
      this.loadGrade(0);// Automatically load the first project
    }
  },

  render: function() {
    var grader = this.state.isLoading ?
      <Loading /> : 
      <GradeList data={this.state.grade} />

    return (
      <div>

        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <MenuButton />
              <a className="navbar-brand" href="#">PAG</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <UserMenu />
            </div>
          </div>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 col-md-2 sidebar">
              <ul className="nav nav-sidebar">
                {this.props.data.map(function(project, i) {
                  return (
                    <li className={project.active ? 'active' : ''}>
                      <a href={'#/grade/'+project.id} key={i} onClick={this.loadGrade.bind(this, i)}>
                        {project.name}
                      </a>
                    </li>
                  );
                }.bind(this))}
              </ul>
            </div>
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
              {grader}
            </div>
          </div>
        </div>

      </div>
    );
  }

});

var MenuButton = React.createClass({
  render: function () {
    return (
      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
    );
  }
});

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

var Loading = React.createClass({
  render: function () {
    return <img src="/static/home/img/loading.gif" />;
  }
});
// }}}

// {{{ Grade
var GradeList = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      data: [{'grade': []}, {'adivice': []}]
    }
  },

  render: function() {
    return (
      <table>
        {this.props.data.map(function(grade, i) {
          return <GradeItemWrapper key={i} data={grade}/>;
        })}
      </table>
    );
  }
});

var GradeItemWrapper = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.data.title}</td>
        <td>{this.props.data.count}/{this.props.data.all_count}</td>
        <td>{this.props.data.point}</td>
      </tr>
    );
  }
});
// }}}

// {{{ App
var App = React.createClass({

  loadProjects: function() {
    $.ajax({
      url: '/api/projects',
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.length > 0) {
          this.setState({page: 'project', projects: data});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      page: 'unauthorized',
      projects: [],
    };
  },

  componentWillMount: function() {},

  render: function() {
    if (this.state.page === 'unauthorized') {
      $('body').attr('id', 'randing');
    } else {
      $('body').attr('id', 'grader');
    }

    return this.state.page === 'unauthorized' ?
      <RandingPage /> :
      <Grader data={this.state.projects}/>
  },

  componentDidMount: function() {
    this.loadProjects();
  }

});
// }}}

React.render(
  <App />,
  document.getElementById('app-conteiner')
);
