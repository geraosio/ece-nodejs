window.onload = function() {
  var deletedDocument = sessionStorage.getItem("deletedDocument")
  if (deletedDocument) {
    $('.alerts-container').append($('<div class="alert alert-success" role="alert">Document with value ' + deletedDocument + ' has been deleted.' + '</div>'))
    sessionStorage.removeItem("deletedDocument")
  }
}

$('#delete-document').click(function(event) {
  event.preventDefault()
  
  $.ajax({
    url: $(this).attr('href'),
    method: 'DELETE',
    succes: function(response) { }
  })
  
  sessionStorage.setItem("deletedDocument", $(this).attr('data-value'))
  location.reload()
})
