// import {PrismaClient} from '@prisma/client';

// export const prisma = new PrismaClient();

import 'dotenv/config';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../../generated/prisma/client';

const connectionString = `${process.env.POSTGRES_URL}`;

const adapter = new PrismaPg({connectionString});
const prisma = new PrismaClient({adapter});

export {prisma};
