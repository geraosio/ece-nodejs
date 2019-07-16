$('#show-metrics').click((e) => {
  e.preventDefault();
  $.getJSON("/metrics", {}, (data) => {
    const content = data.map(d => {
      return 'timestamp: '+d.timestamp+', value: '+d.value+'';
    })
    $('#metrics').append(content.join("\n"));
  });
})
