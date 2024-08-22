document.addEventListener('DOMContentLoaded', function () {
  const downloadUrl = document.getElementById('download-url') ? document.getElementById('download-url').value : null

  if (downloadUrl) {
    window.location.href = downloadUrl
  }
})
