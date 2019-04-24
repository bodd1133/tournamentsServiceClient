import { MockInterface } from '@seneca/service-framework/libraries-out/testing-library/src';
import tournamentsServiceInterface from '@seneca/tournaments-service-dev/utils/tests-interface/interface-definition';
import uuidv4 from 'uuid/v4';
import tournamentsServiceClient from '../src/tournamentsServiceClient';
import { getServiceClientOptions } from './testUtils';

const {
  successNoTournaments,
  successFetchMyTournamentsBelowLimit,
  successFetchMyTournamentsUpToLimit
} = new MockInterface(tournamentsServiceInterface).endpoints.fetchMyTournaments;

describe('tournamentsServiceClient#fetchMyTournaments', function() {
  it('successNoTournaments', async function() {
    const { tournaments } = await successNoTournaments.buildTestData()
    const userId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successNoTournaments.mockFetchBuilder({ userId }),
      await getServiceClientOptions(userId)
    );
    const returnedTournaments = await subject.fetchTournaments();
    expect(returnedTournaments.count).toEqual(0);
    //MAY HAVE TO ADD additional calculate field
    expect(returnedTournaments.items).toEqual(tournaments);
  });
  it('successFetchMyTournamentsBelowLimit', async function() {
    const { tournaments } = await successFetchMyTournamentsBelowLimit.buildTestData()
    const userId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successFetchMyTournamentsBelowLimit.mockFetchBuilder({ userId }),
      await getServiceClientOptions(userId)
    );
    const returnedTournaments = await subject.fetchMyTournaments();
    expect(returnedTournaments.count).toEqual(6);
    expect(returnedTournaments.items).toEqual(tournaments);
  });
  it('successFetchMyTournamentsUpToLimit', async function() {
    const { tournaments } = await successFetchMyTournamentsUpToLimit.buildTestData()
    const userId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successFetchMyTournamentsUpToLimit.mockFetchBuilder({ userId }),
      await getServiceClientOptions(userId)
    );
    const returnedTournaments = await subject.fetchTournaments();
    expect(returnedTournaments.count).toEqual(6);
    expect(returnedTournaments.items).toEqual(tournaments);
  });
});
