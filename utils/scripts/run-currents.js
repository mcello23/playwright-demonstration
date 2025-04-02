import { execSync } from 'child_process';

const command = `yarn pwc --key ${process.env.CURRENTS_RECORD_KEY} --project-id ${process.env.CURRENTS_PROJECT_ID} --workers=1`;
execSync(command, { stdio: 'inherit' });