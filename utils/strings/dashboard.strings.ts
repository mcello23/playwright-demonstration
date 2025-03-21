type DashboardTexts = {
  [key: string]: {
    lang: string;
    hours: string;
    sevenDays: string;
    thirtyDays: string;
    newOnboardings: string;
    authentications: string;
    onboardings: string;
    successRate: string;
    errorRate: string;
    allOperations: string;
    succeeded: string;
    started: string;
    expired: string;
    cancelled: string;
    blocked: string;
    denied: string;
    error: string;
  };
};

export const dashboardTexts: DashboardTexts = {
  en: {
    lang: 'en',
    hours: 'hours',
    sevenDays: '7 days',
    thirtyDays: '30 days',
    newOnboardings: 'New onboardings',
    authentications: 'Authentications',
    onboardings: 'Onboardings',
    successRate: 'Success rate',
    errorRate: 'Error rate',
    allOperations: 'All operations (%)',
    succeeded: 'Succesful',
    started: 'Started',
    expired: 'Expired',
    cancelled: 'Cancelled',
    blocked: 'Blocked',
    denied: 'Rejected',
    error: 'Error',
  },
  es: {
    lang: 'es',
    hours: 'horas',
    sevenDays: '7 días',
    thirtyDays: '30 días',
    newOnboardings: 'Nuevos registros',
    authentications: 'Autenticaciones',
    onboardings: 'Onboardings',
    successRate: 'Tasa de éxito',
    errorRate: 'Tasa de errores',
    allOperations: 'Todas las operaciones (%)',
    succeeded: 'Exitosa',
    started: 'Iniciado',
    expired: 'Expirado',
    cancelled: 'Cancelado',
    blocked: 'Bloqueado',
    denied: 'Rechazado',
    error: 'Error',
  },
  pt: {
    lang: 'pt',
    hours: 'horas',
    sevenDays: '7 dias',
    thirtyDays: '30 dias',
    newOnboardings: 'Novos registros',
    authentications: 'Autenticações',
    onboardings: 'Onboardings',
    successRate: 'Taxa de sucesso',
    errorRate: 'Taxa de erro',
    allOperations: 'Todas as operações (%)',
    succeeded: 'Conseguiu',
    started: 'Iniciado',
    expired: 'Expirado',
    cancelled: 'Cancelado',
    blocked: 'Bloqueado',
    denied: 'Negado',
    error: 'Erro',
  },
};
