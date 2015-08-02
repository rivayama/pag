var Table     = require('react-bootstrap').Table;
var Glyphicon = require('react-bootstrap').Glyphicon;

var GradeUsers = React.createClass({
  render: function() {
    var users = this.props.data.concat(); // propsの変更は全体に影響するのでconcatでコピーする
    users.sort(function(x,y) {
      if (x.created > y.created) return -1;
      if (x.created < y.created) return 1;
      return 0;
    });
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
          <th>コメント文字数</th>
          <th>一回あたりのコメント文字数</th>
        </tr>
        </thead>
        <tbody>
        {users.map(function(user, i) {
          return (
            <tr>
            <td>{user.name}</td>
            <td>{user.created}</td>
            <td>{user.no_closed}</td>
            <td>{user.updated}</td>
            <td>{user.comments_count}</td>
            <td>{user.comments_length}</td>
            <td>{user.comments_length_each}</td>
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
