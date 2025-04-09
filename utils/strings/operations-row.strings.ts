type OperationsTexts = {
  [key: string]: {
    lang: string;
    title: string;
    startDate: string;
    endDate: string;
    userID: string;
    type: string;
    steps: string;
    Assets: string | RegExp;
    status: string;
    actions: string | RegExp;
    expired: string;
    successful: string;
    rejected: string;
  };
};

export const operationsTexts: OperationsTexts = {
  en: {
    lang: 'en',
    title: 'Operations',
    startDate: 'Start Date',
    endDate: 'End Date',
    userID: 'User ID',
    type: 'Type',
    steps: 'Steps',
    Assets: 'Assets',
    status: 'Status',
    actions: 'Actions',
    expired: 'Expired',
    successful: 'Successful',
    rejected: 'Rejected',
  },
  es: {
    lang: 'es',
    title: 'Operaciones',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha de finalización',
    userID: 'ID de usuario',
    type: 'Tipo',
    steps: 'Pasos',
    Assets: 'Ficheros',
    status: 'Estado',
    actions: 'Acciones',
    expired: 'Caducada',
    successful: 'Exitosa',
    rejected: 'Rechazada',
  },
  pt: {
    lang: 'pt',
    title: 'Operações',
    startDate: 'Data de Início',
    endDate: 'Data de Término',
    userID: 'ID do usuário',
    type: 'Tipo',
    steps: 'Passos',
    Assets: 'Ativos',
    status: 'Status',
    actions: /Ações/,
    expired: 'Expirado',
    successful: 'Conseguiu',
    rejected: 'Negado',
  }, // TODO: add filters and buttons texts
};
