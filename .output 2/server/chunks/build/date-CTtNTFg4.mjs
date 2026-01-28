import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatDate = (date, formatStr = "dd/MM/yyyy") => {
  if (!date) return "";
  return format(new Date(date), formatStr, { locale: fr });
};
const formatLibraryDate = (date) => {
  return formatDate(date, "d MMM yyyy");
};

export { formatLibraryDate as a, formatDate as f };
//# sourceMappingURL=date-CTtNTFg4.mjs.map
