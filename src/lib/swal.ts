import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Create a configured Swal instance
const MySwal = withReactContent(Swal)

// Custom styling configuration
export const swalConfig = {
    customClass: {
        popup: 'rounded-lg',
        confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors ml-2',
    },
    buttonsStyling: false,
}

export const showConfirmDialog = async (options: {
    title: string
    text?: string
    html?: string
    icon?: 'warning' | 'error' | 'success' | 'info' | 'question'
    confirmButtonText?: string
    cancelButtonText?: string
}) => {
    return await MySwal.fire({
        ...swalConfig,
        title: options.title,
        text: options.text,
        html: options.html,
        icon: options.icon || 'question',
        showCancelButton: true,
        confirmButtonText: options.confirmButtonText || 'Confirm',
        cancelButtonText: options.cancelButtonText || 'Cancel',
    })
}

export const showSuccessDialog = async (title: string, text?: string) => {
    return await MySwal.fire({
        ...swalConfig,
        title,
        text,
        icon: 'success',
        confirmButtonText: 'OK',
    })
}

export const showErrorDialog = async (title: string, text?: string) => {
    return await MySwal.fire({
        ...swalConfig,
        title,
        text,
        icon: 'error',
        confirmButtonText: 'OK',
    })
}

export const showFormDialog = async <T extends Record<string, any>>(options: {
    title: string
    html: string
    preConfirm: () => T | Promise<T>
    confirmButtonText?: string
    cancelButtonText?: string
}) => {
    return await MySwal.fire({
        ...swalConfig,
        title: options.title,
        html: options.html,
        showCancelButton: true,
        confirmButtonText: options.confirmButtonText || 'Submit',
        cancelButtonText: options.cancelButtonText || 'Cancel',
        focusConfirm: false,
        preConfirm: options.preConfirm,
    })
}

export default MySwal
