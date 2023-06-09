import { DataSource } from '@infra/database';

export const accountIsOwnerOfClient = async (
  clientId: string,
  accountId: string
): Promise<boolean> => {
  const isOwner = await DataSource.client.findFirst({
    where: {
      AND: {
        accountId,
        id: clientId
      }
    }
  });

  if (isOwner !== null) return true;

  return false;
};
