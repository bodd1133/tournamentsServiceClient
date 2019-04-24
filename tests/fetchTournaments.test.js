import { MockInterface } from '@seneca/service-framework/libraries-out/testing-library/src';
import tournamentsServiceInterface from '@seneca/tournaments-service-dev/utils/tests-interface/interface-definition';
import uuidv4 from 'uuid/v4';
import tournamentsServiceClient from '../src/tournamentsServiceClient';
import { getServiceClientOptions } from './testUtils';

const {
  successNoTournaments,
  successFetchAllTournamentsBelowLimit,
  successFetchAllTournamentsUpToLimit
} = new MockInterface(tournamentsServiceInterface).endpoints.fetchTournaments;

describe('tournamentsServiceClient#fetchTournaments', function() {
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
  it('successFetchAllTournamentsBelowLimit', async function() {
    const { tournaments } = await successFetchAllTournamentsBelowLimit.buildTestData()
    const userId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successFetchAllTournamentsBelowLimit.mockFetchBuilder({ userId }),
      await getServiceClientOptions(userId)
    );
    const returnedTournaments = await subject.fetchTournaments();
    expect(returnedTournaments.count).toEqual(6);
    expect(returnedTournaments.items).toEqual(tournaments);
  });
  it('successFetchAllTournamentsUpToLimit', async function() {
    const { tournaments } = await successFetchAllTournamentsUpToLimit.buildTestData()
    const userId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successFetchAllTournamentsUpToLimit.mockFetchBuilder({ userId }),
      await getServiceClientOptions(userId)
    );
    const returnedTournaments = await subject.fetchTournaments();
    expect(returnedTournaments.count).toEqual(6);
    expect(returnedTournaments.items).toEqual(tournaments);
  });
});
