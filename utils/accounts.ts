type TestAccount = {
  username: string;
  password: string;
};

const accounts: TestAccount[] = [
  {
    username: process.env.USER_EMAIL_1 ?? '',
    password: process.env.USER_PASSWORD_1 ?? '',
  },
  {
    username: process.env.USER_EMAIL_2 ?? '',
    password: process.env.USER_PASSWORD_2 ?? '',
  },
  {
    username: process.env.USER_EMAIL_3 ?? '',
    password: process.env.USER_PASSWORD_3 ?? '',
  },
  // Adicione mais contas conforme necessário
];

export async function acquireAccount(workerId: number): Promise<TestAccount> {
  // Usa o workerId para selecionar uma conta específica
  const accountIndex = workerId % accounts.length;
  return accounts[accountIndex];
}
