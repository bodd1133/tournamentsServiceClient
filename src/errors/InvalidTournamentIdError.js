import { ExtendableError } from "@seneca/client-library";

/**
 * Error when tournament id is not valid
 * @param {string} id the id of the tournament
 */

export default class InvalidTournamentIdError extends ExtendableError {
  constructor(id) {
    super(`tournament: id ${id} is invalid`);
    this.id = id;
  }
}
