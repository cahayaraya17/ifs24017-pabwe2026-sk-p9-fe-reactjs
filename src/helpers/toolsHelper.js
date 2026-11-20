import Swal from 'sweetalert2'

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function showSuccessAlert(title, text = '') {
  return Swal.fire({ icon: 'success', title, text, timer: 1600, showConfirmButton: false })
}

export function showErrorAlert(title, text = '') {
  return Swal.fire({ icon: 'error', title, text })
}

export async function showConfirmDialog(title, text) {
  const res = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal',
  })
  return res.isConfirmed
}