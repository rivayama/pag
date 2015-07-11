var Table     = require('react-bootstrap').Table;
var Glyphicon = require('react-bootstrap').Glyphicon;

var GradeUsers = React.createClass({
  render: function() {
    return (
      <div>
        <h3> 個人の活動サマリー </h3>
        <Table bordered condensed hover>
        <thead>
        <tr>
          <th>名前</th>
          <th>作成したチケット数</th>
          <th>担当中のチケット数</th>
          <th>チケット更新回数</th>
          <th>コメント回数</th>
          <th>コメントした文字数</th>
        </tr>
        </thead>
        <tbody>
        {this.props.data.map(function(user, i) {
          return (
            <tr>
            <td>{user.name}</td>
            <td>{user.created}</td>
            <td>{user.no_closed}</td>
            <td>{user.updated}</td>
            <td>{user.comments_count}</td>
            <td>{user.comments_length}</td>
            </tr>
          );
        })}
        </tbody>
        </Table>
      </div>
    );
  }
});

module.exports = GradeUsers;
