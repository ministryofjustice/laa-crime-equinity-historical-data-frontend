document.addEventListener('DOMContentLoaded', function () {
  const formElement = document.querySelector('form')

  // Handle form submission
  formElement.addEventListener('submit', function () {
    // Set a timeout
    setTimeout(function () {
      const errorSummary = document.getElementById('error-summary')
      if (errorSummary) {
        errorSummary.remove()
      }

      // Clear individual field errors
      const errorFields = document.querySelectorAll('.govuk-form-group--error')
      errorFields.forEach(function (errorField) {
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
    }, 250)
  })

  // toggle CRM 14 fields
  const crmTypeDropDown = document.getElementById('crmType')
  if (crmTypeDropDown) {
    crmTypeDropDown.addEventListener('change', function () {
      const crm14Container = document.getElementById('crm14Container')
      if (crm14Container) {
        crm14Container.style.display = crmTypeDropDown.value === 'crm14' ? 'block' : 'none'
      }
    })
  }

  const crmTypeDropdown = document.getElementById('crmType')
  const crm14Container = document.getElementById('crm14Container')
  if (crmTypeDropdown && crm14Container) {
    crm14Container.style.display = crmTypeDropdown.value === 'crm14' ? 'block' : 'none'
  }

  // const crmTypeDropdown = document.getElementById('crmType');
  const providerAccountField = document.getElementById('providerAccountField')

  function toggleProviderAccountField() {
    if (crmTypeDropdown && providerAccountField) {
      providerAccountField.style.display = crmTypeDropdown.value === 'crm4' ? 'block' : 'none'
    }
  }

  // Set the initial state on page load
  if (crmTypeDropdown) {
    toggleProviderAccountField() // Ensure the correct initial state
    crmTypeDropdown.addEventListener('change', toggleProviderAccountField)
  }
})
