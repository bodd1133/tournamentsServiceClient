import { MockInterface } from '@seneca/service-framework/libraries-out/testing-library/src';
import tournamentsServiceInterface from '@seneca/tournaments-service-dev/utils/tests-interface/interface-definition';
import { MissingParamError } from '@seneca/client-library';
import uuidv4 from 'uuid/v4';
import TournamentsServiceClient from '../src/TournamentsServiceClient';
import { getServiceClientOptions } from './testUtils';

const enrolmentsCatalogue = { getStoredObjects: () => [] };
const limit = 200;

const {
  successNoTournamentEnrolments,
  successFetchAllTournamentEnrolments
} = new MockInterface(
  tournamentsServiceInterface
).endpoints.fetchTournamentEnrolments;

describe('tournamentsServiceClient#fetchTournamentEnrolments', function() {
  it('throws error if tournamentId field not supplied', async function() {
    const client = new TournamentsServiceClient(function fetch() {},
    await getServiceClientOptions());

    await expect(client.fetchTournamentEnrolments()).rejects.toThrow(
      new MissingParamError('tournamentId')
    );
  });
  it('successNoTournamentEnrolments', async function() {
    const {
      tournamentEnrolments
    } = await successNoTournamentEnrolments.buildTestData();
    const userId = uuidv4();
    const tournamentId = uuidv4();
    const subject = new TournamentsServiceClient(
      await successNoTournamentEnrolments.mockFetchBuilder({
        userId,
        tournamentId,
        enrolmentsCatalogue,
        limit
      }),
      await getServiceClientOptions(userId)
    );
    const returnedTournamentEnrolments = await subject.fetchTournamentEnrolments(
      tournamentId,
      limit
    );
    expect(returnedTournamentEnrolments.count).toEqual(0);
    expect(returnedTournamentEnrolments.items).toEqual(tournamentEnrolments);
  });
  it('successFetchAllTournamentEnrolments', async function() {
    await successFetchAllTournamentEnrolments.buildTestData();
    const userId = uuidv4();
    const tournamentId = uuidv4();

    const subject = new TournamentsServiceClient(
      await successFetchAllTournamentEnrolments.mockFetchBuilder({
        userId,
        tournamentId,
        enrolmentsCatalogue,
        limit
      }),
      await getServiceClientOptions(userId)
    );
    const returnedTournamentEnrolments = await subject.fetchTournamentEnrolments(
      tournamentId,
      limit
    );
    expect(returnedTournamentEnrolments.count).toEqual(100);
    returnedTournamentEnrolments.items.forEach(en => {
      expect(Object.keys(en)).toEqual(
        expect.arrayContaining(['userId', 'tournamentId', 'timeEnroled'])
      );
    });
  });
});
