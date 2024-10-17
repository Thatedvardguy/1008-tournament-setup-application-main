import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Button, Form } from './widgets';
import { history } from './index';
import GameDetails from './GameDetails';
import { teamStore, gameStore, tournamentStore, playerStore, createDatabase } from './stores';

///////////////////////
// Manage tournament //
///////////////////////

class TournamentDetails extends Component {
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
    if (!this.games || !tournamentStore.tournament)
      return (
        <Card title="Manage tournament">
          <Card>There was a problem loading this tournament from the dataabse.</Card>
        </Card>
      );

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
            edit={false}
            team1={this.indexOfTeam(game.team1_id)}
            team2={this.indexOfTeam(game.team2_id)}
            rerender={() => this.setUpdate()}
          />
        ))}

        <Card>
          <Row>
            <Column>
              <Button.Primary onClick={this.edit}>Edit Tournament</Button.Primary>
            </Column>
            <Column right>
              <Button.Secondary onClick={this.back}>Back</Button.Secondary>
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

  edit() {
    history.push('/tournaments/' + this.props.match.params.id + '/edit');
  }

  back() {
    history.push('/tournaments');
  }
}

export default TournamentDetails;
