import { MockInterface } from '@seneca/service-framework/libraries-out/testing-library/src';
import tournamentsServiceInterface from '@seneca/tournaments-service-dev/utils/tests-interface/interface-definition';
import { MissingParamError } from '@seneca/client-library';
import uuidv4 from 'uuid/v4';
import tournamentsServiceClient from '../src/tournamentsServiceClient';
import { getServiceClientOptions } from './testUtils';

const {
  successNoTournamentEnrolments,
  successFetchAllTournamentEnrolmentsBelowLimit,
  successFetchAllTournamentEnrolmentsUpToLimit
} = new MockInterface(tournamentsServiceInterface).endpoints.fetchTournaments;

describe('tournamentsServiceClient#fetchTournamentEnrolments', function() {
  it('throws error if tournamentId field not supplied', async function() {
    const client = new tournamentsServiceClient(function fetch() {},
    await getServiceClientOptions());
    await expect(client.fetchTournamentEnrolments()).rejects.toThrow(
      new MissingParamError('tournamentId')
    );
  });
  it('successNoTournamentEnrolments', async function() {
    const { tournamentEnrolments } = await successNoTournamentEnrolments.buildTestData()
    const userId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successNoTournamentEnrolments.mockFetchBuilder({ userId }),
      await getServiceClientOptions(userId)
    );
    const returnedTournamentEnrolments = await subject.fetchTournamentEnrolments(tournamentId);
    expect(returnedTournamentEnrolments.count).toEqual(0);
    expect(returnedTournamentEnrolments.items).toEqual(tournamentEnrolments);
  });
  it('successFetchAllTournamentEnrolmentsBelowLimit', async function() {
    const { tournamentEnrolments } = await successFetchAllTournamentEnrolmentsBelowLimit.buildTestData()
    const userId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successFetchAllTournamentEnrolmentsBelowLimit.mockFetchBuilder({ userId }),
      await getServiceClientOptions(userId)
    );
    const returnedTournamentEnrolments = await subject.fetchTournamentEnrolments(tournamentId);
    expect(returnedTournamentEnrolments.count).toEqual(6);
    expect(returnedTournamentEnrolments.items).toEqual(tournamentEnrolments);
  });
  it('successFetchAllTournamentEnrolmentsUpToLimit', async function() {
    const { tournamentEnrolments } = await successFetchAllTournamentEnrolmentsUpToLimit.buildTestData()
    const userId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successFetchAllTournamentEnrolmentsUpToLimit.mockFetchBuilder({ userId }),
      await getServiceClientOptions(userId)
    );
    const returnedTournamentEnrolments = await subject.fetchTournamentEnrolments(tournamentId);
    expect(returnedTournamentEnrolments.count).toEqual(6);
    expect(returnedTournamentEnrolments.items).toEqual(tournamentEnrolments);
  });
});
