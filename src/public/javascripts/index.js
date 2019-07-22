
// Save the deleted metric to show an alert after page refresh
//
window.onload = function() {
  var deletedMetric = sessionStorage.getItem("deletedMetric")
  if (deletedMetric) {
    $('.alerts-container').append($('<div class="alert alert-success" role="alert">Document with value ' + deletedMetric + ' has been deleted.' + '</div>'))
    sessionStorage.removeItem("deletedMetric")
  }
}

$('#delete-metric').click(function(event) {
  event.preventDefault()
  
  $.ajax({
    url: $(this).attr('href'),
    method: 'DELETE',
    success: function(response) {
      console.log("Deletion of metric successful")
    }
  })
  
  sessionStorage.setItem("deletedMetric", $(this).attr('data-value'))
  location.reload()
})





// Retrieve the user metrics and construct the chart
//
$.getJSON("/metrics", {}, (data) => {
  var values = []
  var times = []
  
  if (data.result[0].metrics) {
    data.result[0].metrics.forEach(function(metric) {
      values.push(metric.value)
      times.push(metric.timestamp)
    })
    
    var ctx = document.getElementById('myChart').getContext('2d');
    
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: values,
        datasets: [{
          label: '',
          data: times,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  
});
