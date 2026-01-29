import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatDate = (date: string | Date | null | undefined, formatStr = 'dd/MM/yyyy') => {
    if (!date) return ''
    const parsedDate = new Date(date)
    // Check if date is valid
    if (isNaN(parsedDate.getTime())) return ''
    return format(parsedDate, formatStr, { locale: fr })
}

export const formatLibraryDate = (date: string | Date | null | undefined) => {
    return formatDate(date, 'd MMM yyyy')
}
