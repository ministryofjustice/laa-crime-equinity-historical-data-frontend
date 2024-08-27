document.addEventListener('DOMContentLoaded', function () {
  const downloadButton = document.querySelector('button[type="submit"]') // Assuming the download button is of type "submit"

  downloadButton.addEventListener('click', function () {
    // Clear error summary
    const errorSummary = document.getElementById('error-summary')
    if (errorSummary) {
      errorSummary.remove()
    }

    // Clear individual field errors
    const errorFields = document.querySelectorAll('.govuk-form-group--error')
    errorFields.forEach(function (errorField) {
      // Remove the error message paragraph
      const errorMessage = errorField.querySelector('.govuk-error-message')
      if (errorMessage) {
        errorMessage.remove()
      }

      // Remove error classes from the form group and input/select elements
      errorField.classList.remove('govuk-form-group--error')
      const inputElement = errorField.querySelector('.govuk-input--error, .govuk-select--error')
      if (inputElement) {
        inputElement.classList.remove('govuk-input--error', 'govuk-select--error')
      }
    })
  })
})
