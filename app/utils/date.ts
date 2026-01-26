import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatDate = (date: string | Date | null | undefined, formatStr = 'dd/MM/yyyy') => {
    if (!date) return ''
    return format(new Date(date), formatStr, { locale: fr })
}

export const formatLibraryDate = (date: string | Date | null | undefined) => {
    return formatDate(date, 'd MMM yyyy')
}
