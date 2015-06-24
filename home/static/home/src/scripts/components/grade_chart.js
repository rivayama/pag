var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var GradeChart = React.createClass({
  getChartData: function() {
    var labels = [], points = [];
    this.props.data.forEach(function(grade) {
      labels.push(grade.title);
      if (grade.point == 0){
        points.push(1);
      }else{
        points.push(grade.point);
      };
    });
    return {
      labels : labels,
      datasets : [
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          data : points,
        }
      ]
    };
  },
  chartOptions: {
    responsive: true,
  },
  render: function() {
    return (
      <Row>
        <Col xs={12} md={12} lg={10} lgOffset={1}>
          <canvas id="chart"></canvas>
        </Col>
      </Row>
    );
  },
  componentDidMount: function() {
    var context = document.getElementById("chart").getContext("2d");
    new Chart(context).Radar(this.getChartData(), this.chartOptions);
  }
});

module.exports = GradeChart;
