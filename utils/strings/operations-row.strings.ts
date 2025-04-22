type OperationsTexts = {
  [key: string]: {
    lang: string;
    title: string;
    startDate: string;
    operationID: string;
    userID: string;
    docNumber: string;
    name: string | RegExp;
    surname: string | RegExp;
    type: string;
    steps: string;
    assets: string | RegExp;
    status: string;
    actions: string | RegExp;
    started: string;
    // successful: string;
    // rejected: string;
  };
};

export const operationsTexts: OperationsTexts = {
  en: {
    lang: 'en',
    title: 'Operations',
    startDate: 'Start Date',
    operationID: 'Operation ID',
    userID: 'User ID',
    docNumber: 'Document number',
    name: /Name/,
    surname: /Surname/,
    type: 'Type',
    steps: 'Steps',
    assets: 'Assets',
    status: 'Status',
    actions: 'Actions',
    started: 'Started',
    // successful: 'Successful',
    // rejected: 'Rejected',
  },
  es: {
    lang: 'es',
    title: 'Operaciones',
    startDate: 'Fecha de inicio',
    operationID: 'ID de operación',
    userID: 'ID de usuario',
    docNumber: 'Número de documento',
    name: 'Nombre',
    surname: 'Apellidos',
    type: 'Tipo',
    steps: 'Pasos',
    assets: 'Ficheros',
    status: 'Estado',
    actions: 'Acciones',
    started: 'Iniciada',
    // successful: 'Exitosa',
    // rejected: 'Rechazada',
  },
  pt: {
    lang: 'pt',
    title: 'Operações',
    startDate: 'Data de Início',
    operationID: 'ID da operação',
    userID: 'ID do usuário',
    docNumber: 'Número do documento',
    name: /Nome/,
    surname: /Sobrenome/,
    type: 'Tipo',
    steps: 'Passos',
    assets: 'Ativos',
    status: 'Status',
    actions: /Ações/,
    started: 'Iniciado',
    // successful: 'Conseguiu',
    // rejected: 'Negado',
  }, // TODO: add filters and buttons texts
};
