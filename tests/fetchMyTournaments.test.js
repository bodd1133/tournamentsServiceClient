import { MockInterface } from '@seneca/service-framework/libraries-out/testing-library/src';
import tournamentsServiceInterface from '@seneca/tournaments-service-dev/utils/tests-interface/interface-definition';
import uuidv4 from 'uuid/v4';
import TournamentsServiceClient from '../src/TournamentsServiceClient';
import { getServiceClientOptions } from './testUtils';

const catalogue = { getStoredObjects: () => [] };
const limit = 200;

const { successNoTournaments, successFetchMyTournaments } = new MockInterface(
  tournamentsServiceInterface
).endpoints.fetchMyTournaments;

describe('tournamentsServiceClient#fetchMyTournaments', function() {
  it('successNoTournaments', async function() {
    const { tournaments } = await successNoTournaments.buildTestData();
    const userId = uuidv4();

    const subject = new TournamentsServiceClient(
      await successNoTournaments.mockFetchBuilder({ userId, limit }),
      await getServiceClientOptions(userId)
    );
    const returnedTournaments = await subject.fetchMyTournaments(limit);
    expect(returnedTournaments.count).toEqual(0);
    expect(returnedTournaments.items).toEqual(tournaments);
  });
  it('successFetchMyTournaments', async function() {
    await successFetchMyTournaments.buildTestData();
    const userId = uuidv4();

    const subject = new TournamentsServiceClient(
      await successFetchMyTournaments.mockFetchBuilder({
        userId,
        catalogue,
        limit
      }),
      await getServiceClientOptions(userId)
    );
    const returnedTournaments = await subject.fetchMyTournaments(limit);
    expect(returnedTournaments.count).toEqual(100);
    returnedTournaments.items.forEach(t => {
      expect(Object.keys(t)).toEqual(
        expect.arrayContaining([
          'tournamentId',
          'startTimestamp',
          'endTimestamp',
          'courseId',
          'description',
          'prize',
          'name',
          'isActive'
        ])
      );
    });
  });
});
