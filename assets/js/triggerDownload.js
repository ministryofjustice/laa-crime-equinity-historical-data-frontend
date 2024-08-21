document.addEventListener('DOMContentLoaded', function () {
  const csvContent = document.getElementById('csv-content')?.value
  if (csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'crmReport.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
})
