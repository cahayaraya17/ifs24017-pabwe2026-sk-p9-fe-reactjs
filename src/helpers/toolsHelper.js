export async function showSuccessAlert(title, text = '') {
  const { default: Swal } = await import('sweetalert2')
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 1500,
    showConfirmButton: false,
  })
}

export async function showErrorAlert(title, text = '') {
  const { default: Swal } = await import('sweetalert2')
  return Swal.fire({
    icon: 'error',
    title,
    text,
  })
}

export async function showConfirmDialog(title, text = '') {
  const { default: Swal } = await import('sweetalert2')
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal',
  })
  return Boolean(result?.isConfirmed)
}