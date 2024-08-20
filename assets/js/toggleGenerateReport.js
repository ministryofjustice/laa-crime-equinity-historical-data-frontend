document.addEventListener('DOMContentLoaded', function () {
  const crmTypeDropDown = document.getElementById('crmType')
  if (crmTypeDropDown) {
    crmTypeDropDown.addEventListener('change', function () {
      const crm14Container = document.getElementById('crm14Container')
      if (crm14Container) {
        crm14Container.style.display = crmTypeDropDown.value === 'crm14' ? 'block' : 'none'
      }
    })
  }
})
