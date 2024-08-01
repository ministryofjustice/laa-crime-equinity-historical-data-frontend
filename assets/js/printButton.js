document.addEventListener('DOMContentLoaded', function () {
  var printButton = document.getElementById('print-button')
  if (printButton) {
    printButton.addEventListener('click', function () {
      window.print()
    })
  }
})
