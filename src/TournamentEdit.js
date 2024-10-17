import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Button, Form } from './widgets';
import { history } from './index';
import GameDetails from './GameDetails';
import { teamStore, gameStore, tournamentStore, playerStore, createDatabase } from './stores';

///////////////////////
// Manage tournament //
///////////////////////

class TournamentEdit extends Component {
  games = [];
  winner = null;

  setUpdate = () => {
    tournamentStore.getTournament(this.props.match.params.id).then(() => {
      this.winner = tournamentStore.tournament.winner_id;
      gameStore.getGamesFromTournament(this.props.match.params.id).then(() => {
        this.games = gameStore.games;
      });
    });
  };

  indexOfTeam(id) {
    return teamStore.teams.find((team) => team.id === id);
  }

  render() {
    if (!this.games || !tournamentStore.tournament) return null;

    return (
      <Card>
        <Card title="Manage tournament" />
        <Card title={tournamentStore.tournament.name}>
          <ul>
            <li>Tournament id: {tournamentStore.tournament.id}</li>
            <li>Tournament name: {tournamentStore.tournament.name}</li>
            <li>Format: {tournamentStore.tournament.type}</li>
            <li>Number of competing teams: {tournamentStore.tournament.number_of_teams}</li>
          </ul>
        </Card>

        <Card>
          <Row>Here you can change the name of the tournament, or delete it.</Row>
          <br />
          <Row>
            You can also change the score of a completed match. Note this will not affect the
            following matches even if the new score would yield a different winner.
          </Row>
          <br />
          <Row>
            If you need to change the format of the tournament, or the number of competing teams,
            please re-create the tournament.
          </Row>
        </Card>
        <Card>
          <Form.Input
            type="text"
            value={tournamentStore.tournament.name}
            onChange={(event) => (tournamentStore.tournament.name = event.currentTarget.value)}
          />
          <Form.Label>Tournament name:</Form.Label>
        </Card>

        {this.winner != null ? (
          <Card>
            <Column center>This Tournament is finished and has crowned a winner.</Column>
            <Column center>
              <b>Congratulations to {this.indexOfTeam(this.winner).name}!</b>
            </Column>
          </Card>
        ) : (
          ''
        )}

        {this.games.map((game) => (
          <GameDetails
            key={game.id}
            gameinfo={game}
            tournamentinfo={tournamentStore.tournament}
            round={game.round}
            edit={true}
            team1={this.indexOfTeam(game.team1_id)}
            team2={this.indexOfTeam(game.team2_id)}
            rerender={() => this.setUpdate()}
          />
        ))}

        <Card>
          <Row>
            <Column>
              <Button.Success onClick={this.save}>Save</Button.Success>
            </Column>
            <Column></Column>
            <Column right>
              <Button.Warning onClick={this.cancel}>Cancel</Button.Warning>
            </Column>
            <Column right>
              <Button.Danger onClick={this.delete}>Delete</Button.Danger>
            </Column>
          </Row>
        </Card>
      </Card>
    );
  }

  mounted() {
    gameStore.games = [];
    tournamentStore.tournament = {
      id: 0,
      name: '',
      type: '',
      number_of_teams: 0,
      winner_id: null,
    };
    teamStore.getTeams();
    tournamentStore.getTournament(this.props.match.params.id).then(() => {
      this.winner = tournamentStore.tournament.winner_id;
      gameStore.getGamesFromTournament(this.props.match.params.id).then(() => {
        this.games = gameStore.games;
      });
    });
  }

  onlySpaces(string) {
    return string.trim().length === 0;
  }

  save() {
    if (
      !tournamentStore.tournament.name ||
      this.onlySpaces(tournamentStore.tournament.name) == true
    ) {
      Alert.info(`Please add a tournament name.`);
      return null;
    }
    tournamentStore.updateTournament();
    history.push('/tournaments/' + this.props.match.params.id);
  }

  cancel() {
    history.push('/tournaments/' + this.props.match.params.id);
  }

  delete() {
    gameStore.getGamesFromTournament(this.props.match.params.id).then(() => {
      gameStore.games.map((game) => {
        gameStore.deleteGame(game);
      });
      tournamentStore.deleteTournament(tournamentStore.tournament);
      history.push('/tournaments/');
      Alert.danger(`Tournament "${tournamentStore.tournament.name}" deleted.`);
    });
  }
}

export default TournamentEdit;
