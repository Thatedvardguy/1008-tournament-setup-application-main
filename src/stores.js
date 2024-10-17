import { pool } from './mysql-pool';
import { sharedComponentData } from 'react-simplified';

/**
 * A storage class to store and manage tournaments
 */
class TournamentStore {
  tournaments = [];
  tournament = {
    id: 0,
    name: '',
    type: '',
    number_of_teams: 0,
    winner_id: null,
  };

  getTournaments() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Tournaments', (error, results) => {
        if (error) return reject(error);

        this.tournaments = results;
        resolve();
      });
    });
  }

  getTournament(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Tournaments WHERE id=?', [id], (error, results) => {
        if (error) return reject(error);

        this.tournament = results[0];
        resolve();
      });
    });
  }

  newTournament(name, type, number) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO `TA_Tournaments`(`name`, `type`, `number_of_teams`) VALUES (?, ?, ?)',
        [name, type, number],
        (error, results) => {
          if (error) return reject(error);

          this.tournament.id = results.insertId;
          console.log(`Tournament "${name}" created.`);
          resolve();
        }
      );
    });
  }

  updateTournament() {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE TA_Tournaments SET name=? WHERE id=?',
        [this.tournament.name, this.tournament.id],
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  updateTournamentWinner() {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE TA_Tournaments SET winner_id=? WHERE id=?',
        [this.tournament.winner_id, this.tournament.id],
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  deleteTournament(tournament) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM TA_Tournaments WHERE id=?', [tournament.id], (error) => {
        if (error) return reject(error);

        console.log(`Tournament "${tournament.name}" deleted.`);
        resolve();
      });
    });
  }
}

/**
 * A storage class to store and manage games
 */
class GameStore {
  allGames = [];
  games = [];
  game = {
    id: 0,
    tournament_id: 0,
    team1_id: null,
    team1_score: 0,
    team2_id: null,
    team2_score: 0,
    winner_id: null,
  };

  getGames() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Games', (error, results) => {
        if (error) return reject(error);

        this.allGames = results;
        resolve();
      });
    });
  }

  getGamesFromTournament(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Games WHERE tournament_id=?', [id], (error, results) => {
        if (error) return reject(error);

        this.games = results;
        resolve();
      });
    });
  }

  getGame(id, success) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Games WHERE id=?', [id], (error, results) => {
        if (error) return reject(error);

        this.game = results[0];
        success(results[0]);
        resolve();
      });
    });
  }

  newGame(t_id, round, team1, team2) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO `TA_Games`(`tournament_id`, `round` ,`team1_id`, `team1_score`, `team2_id`, `team2_score`) VALUES (?, ?, ?, ?, ?, ?)',
        [t_id, round, team1, 0, team2, 0],
        (error, results) => {
          if (error) return reject(error);

          console.log(`Game "${results.insertId}" created.`);
          resolve();
        }
      );
    });
  }

  updateGameScore() {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE TA_Games SET team1_score=?, team2_score=? WHERE id=?',
        [this.game.team1_score, this.game.team2_score, this.game.id],
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  updateGameTeam1(team1, id) {
    return new Promise((resolve, reject) => {
      pool.query('UPDATE TA_Games SET team1_id=? WHERE id=?', [team1, id], (error) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  updateGameTeam2(team2, id) {
    return new Promise((resolve, reject) => {
      pool.query('UPDATE TA_Games SET team2_id=? WHERE id=?', [team2, id], (error) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  updateGameWinner() {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE TA_Games SET winner_id=? WHERE id=?',
        [this.game.winner_id, this.game.id],
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  deleteGame(game) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM TA_Games WHERE id=?', game.id, (error) => {
        if (error) return reject(error);

        console.log(`Game "${game.id}" deleted.`);
        resolve();
      });
    });
  }
}

/**
 * A storage class to store and manage teams
 */
class TeamStore {
  teams = [];
  team = {
    id: 0,
    name: '',
    number_of_players: 0,
  };

  getTeams() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Teams', (error, results) => {
        if (error) return reject(error);

        this.teams = results;
        resolve();
      });
    });
  }

  getTeam(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Teams WHERE id=?', [id], (error, results) => {
        if (error) return reject(error);

        this.team = results[0];
        resolve();
      });
    });
  }

  getTeamByName(name) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Teams WHERE name=?', [name], (error, results) => {
        if (error) return reject(error);

        this.team = results[0];
        resolve();
      });
    });
  }

  newTeam() {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO `TA_Teams`(`name`, `number_of_players`) VALUES (?, ?)',
        [this.team.name, this.team.number_of_players],
        (error, results) => {
          if (error) return reject(error);

          this.team.id = results.insertId;
          console.log(`Team "${this.team.name}" created.`);
          resolve();
        }
      );
    });
  }

  updateTeam(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE TA_Teams SET name=?, number_of_players=? WHERE id=?',
        [this.team.name, this.team.number_of_players, id],
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  deleteTeam(team) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM TA_Teams WHERE id=?', team.id, (error) => {
        if (error) return reject(error);

        console.log(`Team "${team.name}" deleted.`);
        resolve();
      });
    });
  }
}

/**
 * A storage class to store and manage players
 */
class PlayerStore {
  players = [];
  teamplayers = [];
  player = null;

  getPlayers() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Players', (error, results) => {
        if (error) return reject(error);

        this.players = results;
        resolve();
      });
    });
  }

  getTeamPlayers(team) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Players WHERE team_id =?', [team.id], (error, results) => {
        if (error) return reject(error);

        this.teamplayers = results;
        resolve();
      });
    });
  }

  getPlayer(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM TA_Players WHERE id=?', [id], (error, results) => {
        if (error) return reject(error);

        this.player = results[0];
        resolve();
      });
    });
  }

  newPlayer(player) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO `TA_Players`(`name`, `team_id`) VALUES (?, ?)',
        [player.name, player.team_id],
        (error, results) => {
          if (error) return reject(error);

          console.log(`Player "${results.insertId}" created.`);
          resolve();
        }
      );
    });
  }

  updatePlayer(player) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE TA_Players SET name=?, team_id=? WHERE id=?',
        [player.name, player.team_id, player.id],
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  deletePlayer(player) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM TA_Players WHERE id=?', player.id, (error) => {
        if (error) return reject(error);

        console.log(`Player ${player.id} "${player.name}" deleted.`);
        resolve();
      });
    });
  }
}

/**
 * A service class to create tables in database from 'mysql-pool.js' if these do not already exist.
 */
class CreateDatabase {
  createTournamentDatabase() {
    return new Promise((resolve, reject) => {
      pool.query(
        'CREATE TABLE IF NOT EXISTS `TA_Tournaments` ( `id` INT NOT NULL AUTO_INCREMENT ,`name` TEXT NOT NULL , `type` TEXT NOT NULL , `number_of_teams` INT NOT NULL , `winner_id` INT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;',
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  createGameDatabase() {
    return new Promise((resolve, reject) => {
      pool.query(
        'CREATE TABLE IF NOT EXISTS `TA_Games` ( `id` INT NOT NULL AUTO_INCREMENT , `tournament_id` INT NOT NULL , `round` TEXT NOT NULL, `team1_id` INT NULL , `team1_score` INT NOT NULL , `team2_id` INT NULL , `team2_score` INT NOT NULL , `winner_id` INT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;',
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  createTeamDatabase() {
    return new Promise((resolve, reject) => {
      pool.query(
        'CREATE TABLE IF NOT EXISTS `TA_Teams` ( `id` INT NOT NULL AUTO_INCREMENT , `name` TEXT NOT NULL , `number_of_players` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;',
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  createPlayerDatabase() {
    return new Promise((resolve, reject) => {
      pool.query(
        'CREATE TABLE IF NOT EXISTS `TA_Players` ( `id` INT NOT NULL AUTO_INCREMENT , `team_id` INT NOT NULL , `name` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;',
        (error) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

export let tournamentStore = sharedComponentData(new TournamentStore());
export let gameStore = sharedComponentData(new GameStore());
export let teamStore = sharedComponentData(new TeamStore());
export let playerStore = sharedComponentData(new PlayerStore());
export let createDatabase = new CreateDatabase();
