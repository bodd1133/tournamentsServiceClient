import { MockInterface } from '@seneca/service-framework/libraries-out/testing-library/src';
import tournamentsServiceInterface from '@seneca/tournaments-service-dev/utils/tests-interface/interface-definition';
import { MissingParamError } from '@seneca/client-library';
import uuidv4 from 'uuid/v4';
import InvalidTournamentIdError from '../src/errors/InvalidTournamentIdError';
import TournamentHasEndedError from '../src/errors/TournamentHasEndedError';
import tournamentsServiceClient from '../src/tournamentsServiceClient';
import { getServiceClientOptions } from './testUtils';

const {
  successValidTournament,
  failureInvalidTournamentId,
  failureTournamentHasEnded
} = new MockInterface(tournamentsServiceInterface).endpoints.deleteTournamentEnrolment;

describe('tournamentsServiceClient#deleteTournamentEnrolment', function() {
  it('throws error if tournamentId field not supplied', async function() {
    const client = new tournamentsServiceClient(function fetch() {},
    await getServiceClientOptions());
    await expect(client.deleteTournamentEnrolment()).rejects.toThrow(
      new MissingParamError('tournamentId')
    );
  });
  it('successValidTournament', async function() {
    await successValidTournament.buildTestData();

    const userId = uuidv4();
    const tournamentId = uuidv4();

    const subject = new tournamentsServiceClient(
      await successValidTournament.mockFetchBuilder({ userId, tournamentId }),
      await getServiceClientOptions(userId)
    );
    await subject.deleteTournamentEnrolment(tournamentId);
  });
  it('failureInvalidTournamentId', async function() {
    await failureInvalidTournamentId.buildTestData();

    const userId = uuidv4();
    const tournamentId = uuidv4();

    const subject = new tournamentsServiceClient(
      await failureInvalidTournamentId.mockFetchBuilder({ userId, tournamentId }),
      await getServiceClientOptions(userId)
    );

    expect(subject.deleteTournamentEnrolment(tournamentId)).rejects.toThrow(
      new InvalidTournamentIdError(tournamentId)
    );
  });
  it('failureTournamentHasEnded', async function() {
    await failureTournamentHasEnded.buildTestData();

    const userId = uuidv4();
    const tournamentId = uuidv4();

    const subject = new tournamentsServiceClient(
      await failureTournamentHasEnded.mockFetchBuilder({ userId, tournamentId }),
      await getServiceClientOptions(userId)
    );

    expect(subject.deleteTournamentEnrolment(tournamentId)).rejects.toThrow(
      new TournamentHasEndedError(tournamentId)
    );
  });
});
