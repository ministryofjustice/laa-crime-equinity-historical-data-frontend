document.addEventListener('DOMContentLoaded', function () {
  const downloadUrl = (document.getElementById('download-url').style.display = 'block')
  if (downloadUrl) {
    window.location.href = downloadUrl.value
  }
})
