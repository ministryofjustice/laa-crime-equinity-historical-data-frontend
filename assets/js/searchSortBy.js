document.addEventListener('DOMContentLoaded', function () {
  const sortByDropDown = document.getElementById('sortBy')
  if (sortByDropDown) {
    sortByDropDown.addEventListener('change', function () {
      document.querySelector('form').submit()
    })
  }
})
