import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Button, Form } from './widgets';
import { history } from './index';
import { teamStore, gameStore, tournamentStore, playerStore } from './stores';

/////////////////
// Manage team //
/////////////////

class TeamDetails extends Component {
  render() {
    if (teamStore.team.id != this.props.match.params.id || playerStore.teamplayers == [])
      return null;

    return (
      <Card>
        <Card title="Manage team"></Card>
        <Card title={teamStore.team.name}>
          <Row>
            <li>Id: {teamStore.team.id}</li>
            <li>Team name: {teamStore.team.name}</li>
            <li>Number of players: {teamStore.team.number_of_players}</li>
          </Row>
        </Card>
        <Card subtitle="Players:">
          {playerStore.teamplayers.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </Card>
        <Card>
          <Row>
            <Column>
              <Button.Primary onClick={this.edit}>Edit Team</Button.Primary>
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
    playerStore.teamplayers = [];
    teamStore.getTeam(this.props.match.params.id).then(() => {
      playerStore.getTeamPlayers(teamStore.team);
    });
  }

  edit() {
    history.push('/teams/' + this.props.match.params.id + '/edit');
  }

  back() {
    history.push('/teams');
  }
}

export default TeamDetails;
