import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Button, Form } from './widgets';
import { history } from './index';
import { teamStore, gameStore, tournamentStore, playerStore } from './stores';

///////////////////////
// Register new team //
///////////////////////

class RegisterTeam extends Component {
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

  render() {
    return (
      <Card>
        <Card title="Add new team">
          <Form.Label>Teamname:</Form.Label>
          <Form.Input
            type="text"
            placeholder="Teamname"
            value={teamStore.team.name}
            onChange={(event) => (teamStore.team.name = event.currentTarget.value)}
          />
          <Form.Label>Number of players: (up to a maximum of 6)</Form.Label>
          <Form.Input
            type="number"
            min={1}
            max={6}
            value={teamStore.team.number_of_players}
            onChange={(event) => (teamStore.team.number_of_players = event.currentTarget.value)}
          />
          {teamStore.team.number_of_players > 0 ? (
            <span>
              <Form.Label>Name of player {this.player1.id}:</Form.Label>
              <Form.Input
                type="text"
                placeholder="Name of player"
                value={this.player1.name}
                onChange={(event) => (this.player1.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 1 ? (
            <span>
              <Form.Label>Name of player {this.player2.id}:</Form.Label>
              <Form.Input
                type="text"
                placeholder="Name of player"
                value={this.player2.name}
                onChange={(event) => (this.player2.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 2 ? (
            <span>
              <Form.Label>Name of player {this.player3.id}:</Form.Label>
              <Form.Input
                type="text"
                placeholder="Name of player"
                value={this.player3.name}
                onChange={(event) => (this.player3.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 3 ? (
            <span>
              <Form.Label>Name of player {this.player4.id}:</Form.Label>
              <Form.Input
                type="text"
                placeholder="Name of player"
                value={this.player4.name}
                onChange={(event) => (this.player4.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 4 ? (
            <span>
              <Form.Label>Name of player {this.player5.id}:</Form.Label>
              <Form.Input
                type="text"
                placeholder="Name of player"
                value={this.player5.name}
                onChange={(event) => (this.player5.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
          {teamStore.team.number_of_players > 5 ? (
            <span>
              <Form.Label>Name of player {this.player6.id}:</Form.Label>
              <Form.Input
                type="text"
                placeholder="Name of player"
                value={this.player6.name}
                onChange={(event) => (this.player6.name = event.currentTarget.value)}
              />
            </span>
          ) : (
            ''
          )}
        </Card>
        <Card>
          <Row>
            <Column>
              <Button.Success onClick={this.save}>Save</Button.Success>
            </Column>
            <Column></Column>
            <Column right>
              <Button.Warning onClick={this.reset}>Reset</Button.Warning>
            </Column>
            <Column right>
              <Button.Warning onClick={this.cancel}>Cancel</Button.Warning>
            </Column>
          </Row>
        </Card>
      </Card>
    );
  }

  mounted() {
    teamStore.team = {
      id: 0,
      name: '',
      number_of_players: 1,
    };
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
      !teamStore.team.number_of_players ||
      this.onlySpaces(toString(teamStore.team.number_of_players)) == true ||
      teamStore.team.number_of_players < 1 ||
      teamStore.team.number_of_players > 6
    ) {
      Alert.info(`Number of players must be a number between 1 and 6`);
      return null;
    }
    if (
      (teamStore.team.number_of_players > 0 && this.onlySpaces(this.player1.name) === true) ||
      (teamStore.team.number_of_players > 1 && this.onlySpaces(this.player2.name) === true) ||
      (teamStore.team.number_of_players > 2 && this.onlySpaces(this.player3.name) === true) ||
      (teamStore.team.number_of_players > 3 && this.onlySpaces(this.player4.name) === true) ||
      (teamStore.team.number_of_players > 4 && this.onlySpaces(this.player5.name) === true) ||
      (teamStore.team.number_of_players > 5 && this.onlySpaces(this.player6.name) === true)
    ) {
      Alert.info(`Please add player names.`);
      return null;
    }

    teamStore
      .newTeam()
      .then(() => {
        this.player1.team_id = teamStore.team.id;
        this.player2.team_id = teamStore.team.id;
        this.player3.team_id = teamStore.team.id;
        this.player4.team_id = teamStore.team.id;
        this.player5.team_id = teamStore.team.id;
        this.player6.team_id = teamStore.team.id;
      })
      .then(() => {
        if (teamStore.team.number_of_players > 0) playerStore.newPlayer(this.player1);
        if (teamStore.team.number_of_players > 1) playerStore.newPlayer(this.player2);
        if (teamStore.team.number_of_players > 2) playerStore.newPlayer(this.player3);
        if (teamStore.team.number_of_players > 3) playerStore.newPlayer(this.player4);
        if (teamStore.team.number_of_players > 4) playerStore.newPlayer(this.player5);
        if (teamStore.team.number_of_players > 5) playerStore.newPlayer(this.player6);
      })
      .finally(() => {
        Alert.success(`Team "${teamStore.team.name}" successfully registered.`);
        this.reset();
      });
  }

  reset() {
    teamStore.team.name = '';
    teamStore.team.number_of_players = 1;
    this.player1.name = '';
    this.player2.name = '';
    this.player3.name = '';
    this.player4.name = '';
    this.player5.name = '';
    this.player6.name = '';
  }

  cancel() {
    history.push('/new');
  }
}

export default RegisterTeam;
