import { acceptanceCerts, locateApi } from '@seneca/service-framework';

export async function getClientOptions(userId) {
  const { protocol, host } = await locateApi('tournaments-service');

  return {
    protocol,
    host,
    credentials: {
      accessToken: acceptanceCerts.createSignedAccessKey(userId)
    },
    delayInSecs: 0,
    retries: 0
  };
}

export const getServiceClientOptions = getClientOptions;
