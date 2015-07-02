var Table     = require('react-bootstrap').Table;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Row       = require('react-bootstrap').Row;
var Col       = require('react-bootstrap').Col;
var Button    = require('react-bootstrap').Button;

var GradeTotal = React.createClass({
  render: function() {
    var total = this.props.data;
    if (total.point < 50) {
      var summaryFont = 'danger';
      var summaryIcon = <Glyphicon glyph='fire' />;
      var summaryGrade = 'E';
      var summaryGradeStyle = {color: '#CD5629'};
    } else if (total.point < 70){
      var summaryFont = 'danger';
      var summaryIcon = '';
      var summaryGrade = 'D';
      var summaryGradeStyle = {color: '#CD5629'};
    } else if (total.point < 85){
      var summaryFont = 'warning';
      var summaryIcon = '';
      var summaryGrade = 'C';
      var summaryGradeStyle = {color: '#FFCC00'};
    } else if (total.point < 95){
      var summaryFont = 'warning';
      var summaryIcon = '';
      var summaryGrade = 'B';
      var summaryGradeStyle = {color: '#00ff00'};
    } else if (total.point <= 100){
      var summaryFont = 'sucess';
      var summaryIcon = '';
      var summaryGrade = 'A';
      var summaryGradeStyle = {color: '#00ff00'};
    }
    return (
      <div>
        <Row>
          <Col xs={12} sm={9} md={9} lg={9}>
            <h2>{total.project_name}</h2>
          </Col>
          <Col xs={12} sm={3} md={3} lg={3} className="text-right">
            <div className="h3"><Button bsStyle='primary' onClick={this.props.executer.bind(/*force=*/true)}>結果を更新</Button></div>
          </Col>
        </Row>
        <Table bordered condensed hover>
        <thead>
        <tr>
          <th>grade</th>
          <th>チケット数</th>
          <th>コメント数</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>
          <div style={summaryGradeStyle} >
            <big><strong> {summaryIcon} {summaryGrade} ({total.point}%)</strong></big>
          </div>
        </td>
        <td>
          <big>{total.issue_count}</big>
        </td>
        <td>
          <big>{total.comment_count}</big>
        </td>
        </tr>
        </tbody>
        </Table>
      </div>
    );
  }
});

module.exports = GradeTotal;
