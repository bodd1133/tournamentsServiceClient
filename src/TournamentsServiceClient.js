import { Client, MissingParamError } from '@seneca/client-library';
import TournamentHasEndedError from './errors/TournamentHasEndedError';
import InvalidTournamentIdError from './errors/InvalidTournamentIdError';

/**
 * TournamentsServiceClient
 * @param {Object} options options object input data and dependency injection
 * @param {Object} options.fetch change fetch method from whatwg-fetch (optional, default: whatwg-fetch)
 * @param {string} options.protocol the http protocol of the service endpoint
 * @param {string} options.host the host of the service endpoint
 * @param {string} options.path the path of the service endpoint (optional)
 * @param {number} options.retries the number of times the client should retry on network error / service error (optional, default: 3)
 * @param {number} options.delayInSecs the delay between retries (optional, default: 2)
 * @param {Object} options.credentials identifiers and secrets required to hit protected endpoints (optional)
 * @param {string} options.region states the region of the service for signing (optional, default: eu-west-1)
 * @param {RequestMaker} options.requestMaker for overriding request making logic (optional, default: RequestMaker)
 * @throws {UrlConstructionError} when either options.protocol or options.host is missing
 */
export default class TournamentsServiceClient extends Client {
  constructor(options) {
    super(options);
  }

  /**
   * Fetches all active tournaments 
   * @throws {RequestLimitExceeded} when the max number of retries has been hit
   * @returns {Array<Tournaments>} an array of tournaments
   */
  async fetchTournaments() {
    const url = `${this.url}/api/tournaments`
    const response = await this.requestMaker.makeRequest(
      url,
      {
        method:'GET'
      },
      [ 200 ]
    );
    return response.json;
  }

   /**
   * Fetches enrolments for a specific tournament 
   * @throws {RequestLimitExceeded} when the max number of retries has been hit
   * @returns {Array<TournamentEnrolments>} an array of tournament enrolments
   */
  async fetchTournamentEnrolments(tournamentId) {
    if (!tournamentId) {
      throw new MissingParamError('tournamentId');
    }

    const url = `${this.url}/api/enrolments/tournaments/${tournamentId}`
    const response = await this.requestMaker.makeRequest(
      url,
      {
        method:'GET'
      },
      [ 200 ]
    );
    return response.json;
  }

  /**
   * Fetches all my tournaments 
   * @throws {RequestLimitExceeded} when the max number of retries has been hit
   * @returns {Array<Tournaments>} an array of tournaments
   */
  async fetchMyTournaments() {
    return await this._makeTournamentRequest('GET');
  }

  /**
   * Enrols a user in a tournament
   * @param {string} tournamentId - the id of the tournament to enrol the user in
   * @throws {UnexpectedServerResponse} when service returns an unexpected response
   * @throws {RequestLimitExceeded} when the max number of retries has been hit
   * @throws {AssignmentDoesNotExistError} when the assignment cannot be found
   * @throws {AssignmentBodyNotValidError} when the assignment body is not valid
   * @returns 
   */
  async putTournamentEnrolment(tournamentId) {
    if (!tournamentId) {
      throw new MissingParamError('tournamentId');
    }

    return await this._makeTournamentRequest('PUT', tournamentId);
  }

  /**
   * Unenrols a user from a tournament
   * @param {string} tournamentId - the id of the tournament to unenrol the user from
   * @throws {UnexpectedServerResponse} when service returns an unexpected response
   * @throws {RequestLimitExceeded} when the max number of retries has been hit
   * @throws {AssignmentDoesNotExistError} when the assignment cannot be found
   * @returns {Promise<undefined>}
   */
  async deleteTournamentEnrolment(tournamentId) {
    if (!tournamentId) {
      throw new MissingParamError('tournamentId');
    }

    return await this._makeTournamentRequest('DELETE', tournamentId);
  }


  async _makeTournamentRequest(
    method,
    tournamentId
  ) {
    let url = `${this.url}/api/enrollments/me/tournaments`;

    if (tournamentId) {
      url += `/${tournamentId}`;
    }

    if (queryParams) {
      url += `?${this.generateQueryParamString(queryParams)}`;
    }

    const expectedResponses = [200, 204, 400, 422];

    const response = await this.requestMaker.makeRequest(
      url,
      {
        method,
        body: body ? JSON.stringify(body) : undefined
      },
      expectedResponses
    );

    if (response.status === 422) {
      throw new InvalidTournamentIdError(tournamentId);
    }

    if (response.status === 400) {
      throw new TournamentHasEndedError();
    }

    return response.json;
  }

  generateQueryParamString(queryParams) {
    if (queryParams && Object.keys(queryParams).length > 0) {
      return Object.keys(queryParams)
        .map(param => `${param}=${encodeURIComponent(queryParams[param])}`)
        .join('&');
    }

    return '';
  }
}
