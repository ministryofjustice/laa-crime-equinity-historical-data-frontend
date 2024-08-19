document.addEventListener('DOMContentLoaded', function () {
  const downloadUrl = document.getElementById('download-url')
  if (downloadUrl) {
    window.location.href = downloadUrl.value
  }
})
