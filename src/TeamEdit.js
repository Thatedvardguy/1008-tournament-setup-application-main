import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Button, Form } from './widgets';
import { history } from './index';
import { teamStore, gameStore, tournamentStore, playerStore } from './stores';

/////////////////
// Manage team //
/////////////////

class TeamEdit extends Component {
  team = {
    id: 0,
    name: '',
    number_of_players: 0,
  };
  player1 = { id: 1, name: '', team_id: 0 };
  player2 = { id: 2, name: '', team_id: 0 };
  player3 = { id: 3, name: '', team_id: 0 };
  player4 = { id: 4, name: '', team_id: 0 };
  player5 = { id: 5, name: '', team_id: 0 };
  player6 = { id: 6, name: '', team_id: 0 };
  deleteWarning = false;

  setDeleteWarning() {
    this.deleteWarning = true;
  }

  render() {
    if (teamStore.team.id != this.props.match.params.id || playerStore.teamplayers == [])
      return null;

    return (
      <Card>
        <Card title="Manage team"></Card>
        <Card>
          <Form.Label>Team name:</Form.Label>
          <Form.Input
            type="text"
            value={teamStore.team.name}
            onChange={(event) => (teamStore.team.name = event.currentTarget.value)}
          />
          {teamStore.team.number_of_players > 0 ? (
            <span>
              <Form.Label>Name of player 1:</Form.Label>
              <Form.Input
                type="text"
                value={this.player1.name}
                onChange={(event) => (this.player1.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 1 ? (
            <span>
              <Form.Label>Name of player 2:</Form.Label>
              <Form.Input
                type="text"
                value={this.player2.name}
                onChange={(event) => (this.player2.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 2 ? (
            <span>
              <Form.Label>Name of player 3:</Form.Label>
              <Form.Input
                type="text"
                value={this.player3.name}
                onChange={(event) => (this.player3.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 3 ? (
            <span>
              <Form.Label>Name of player 4:</Form.Label>
              <Form.Input
                type="text"
                value={this.player4.name}
                onChange={(event) => (this.player4.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 4 ? (
            <span>
              <Form.Label>Name of player 5:</Form.Label>
              <Form.Input
                type="text"
                value={this.player5.name}
                onChange={(event) => (this.player5.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 5 ? (
            <span>
              <Form.Label>Name of player 6:</Form.Label>
              <Form.Input
                type="text"
                value={this.player6.name}
                onChange={(event) => (this.player6.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
        </Card>

        <Card>
          {this.deleteWarning == true ? (
            <Card>
              <Row>
                <Column>
                  Warning! Deleting a team that is part of an active tournament may cause problems.
                  Are you sure you want to delete this team?
                </Column>
              </Row>
            </Card>
          ) : (
            ''
          )}
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
    teamStore.getTeam(this.props.match.params.id).then(() => {
      playerStore.teamplayers = [];
      playerStore.getTeamPlayers(teamStore.team).then(() => {
        if (
          (teamStore.team.number_of_players > 0 ? (this.player1 = playerStore.teamplayers[0]) : '',
          teamStore.team.number_of_players > 1 ? (this.player2 = playerStore.teamplayers[1]) : '',
          teamStore.team.number_of_players > 2 ? (this.player3 = playerStore.teamplayers[2]) : '',
          teamStore.team.number_of_players > 3 ? (this.player4 = playerStore.teamplayers[3]) : '',
          teamStore.team.number_of_players > 4 ? (this.player5 = playerStore.teamplayers[4]) : '',
          teamStore.team.number_of_players > 5 ? (this.player6 = playerStore.teamplayers[5]) : '')
        );
      });
    });
  }

  onlySpaces(string) {
    return string.trim().length === 0;
  }

  save() {
    if (!teamStore.team.name || this.onlySpaces(teamStore.team.name) == true) {
      Alert.info(`Please add a team name.`);
      return null;
    }
    if (
      (teamStore.team.number_of_players > 0 && this.player1.name == '') ||
      (teamStore.team.number_of_players > 1 && this.player2.name == '') ||
      (teamStore.team.number_of_players > 2 && this.player3.name == '') ||
      (teamStore.team.number_of_players > 3 && this.player4.name == '') ||
      (teamStore.team.number_of_players > 4 && this.player5.name == '') ||
      (teamStore.team.number_of_players > 5 && this.player6.name == '')
    ) {
      Alert.info(`Please add player names.`);
      return null;
    }

    teamStore
      .updateTeam(teamStore.team.id)
      .then(() => {
        this.player1.team_id = teamStore.team.id;
        this.player2.team_id = teamStore.team.id;
        this.player3.team_id = teamStore.team.id;
        this.player4.team_id = teamStore.team.id;
        this.player5.team_id = teamStore.team.id;
        this.player6.team_id = teamStore.team.id;
      })
      .then(() => {
        if (teamStore.team.number_of_players > 0) playerStore.updatePlayer(this.player1);
        if (teamStore.team.number_of_players > 1) playerStore.updatePlayer(this.player2);
        if (teamStore.team.number_of_players > 2) playerStore.updatePlayer(this.player3);
        if (teamStore.team.number_of_players > 3) playerStore.updatePlayer(this.player4);
        if (teamStore.team.number_of_players > 4) playerStore.updatePlayer(this.player5);
        if (teamStore.team.number_of_players > 5) playerStore.updatePlayer(this.player6);
      })
      .finally(() => {
        Alert.success(`Team "${teamStore.team.name}" updated.`);
        history.push('/teams/' + this.props.match.params.id);
      });
  }

  cancel() {
    history.push('/teams/' + this.props.match.params.id);
  }

  delete() {
    if (this.deleteWarning === false) {
      this.deleteWarning = true;
      return null;
    }
    playerStore.teamplayers.map((player) => {
      playerStore.deletePlayer(player);

      teamStore.deleteTeam(teamStore.team);
      history.push('/teams/');
      Alert.danger(`Team "${teamStore.team.name}" deleted.`);
    });
  }
}

export default TeamEdit;
