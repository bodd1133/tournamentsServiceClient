import { ExtendableError } from "@seneca/client-library";

/**
 * Error for when user tries to enrol/unenrol in expired tournament
 * @param {string} id the id of the tournament
 */

export default class TournamentHasEndedError extends ExtendableError {
  constructor(id) {
    super(`tournament: id ${id} has expired`);

    this.id = id;
  }
}
