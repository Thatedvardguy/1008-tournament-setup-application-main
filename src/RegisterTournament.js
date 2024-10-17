import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Button, Form } from './widgets';
import { history } from './index';
import { teamStore, gameStore, tournamentStore, playerStore } from './stores';

/////////////////////////////
// Register new tournament //
/////////////////////////////

class RegisterTournament extends Component {
  format = null;
  selectedCount = null;
  randomize = null;
  selectabeTeams = [];
  selectedTeams = [];

  render() {
    if (!teamStore.teams || !this.selectabeTeams || !tournamentStore.tournament) return null;

    return (
      <Card>
        <Card title="Add new tournament">
          <Form.Label>Tournament name:</Form.Label>
          <Form.Input
            type="text"
            placeholder="Tournament name..."
            value={tournamentStore.tournament.name}
            onChange={(event) => {
              tournamentStore.tournament.name = event.currentTarget.value;
            }}
          />
          <br />
          <Row>
            <Column width={4}>
              <Form.Label>Choose a format:</Form.Label>
              <Form.Select2
                id="tournamentFormat"
                value1="Single Elimination"
                value2="Double Elimination"
                onChange={(event) => {
                  this.format = event.currentTarget.value;
                }}
              />
              <br />
              <Form.Label>Choose number of teams:</Form.Label>
              <Form.Select3
                id="numberOfTeams"
                value1="4"
                value2="8"
                value3="16"
                onChange={(event) => {
                  this.selectedCount = event.currentTarget.value;
                  if (this.selectedCount > this.selectabeTeams.length) {
                    Alert.warning(
                      `Unfortunately there aren't enough teams in the database to support ${this.selectedCount} teams in the tournament.`
                    );
                  }
                }}
              />
              <br />
              <Form.Label>Random draft?</Form.Label>
              <Form.Select2
                id="drafting"
                value1="Random"
                value2="Seeded"
                onChange={(event) => {
                  this.randomize = event.currentTarget.value;
                }}
              />
            </Column>
            <Column width={8} Right>
              <Card>
                Format description: <br />
                {this.format === 'Single Elimination'
                  ? 'Single elimination is a standard tournament format where the winner must remain undefeated throughout the tournament.'
                  : ''}
                {this.format === 'Double Elimination'
                  ? 'In double elimination a team must have two losses to be knocked out. This results in two brackets after the first round of matches, an upper bracket and a lower bracket. Losses in the upper bracket would relegate a team to the lower bracket.'
                  : ''}
              </Card>
              <Card>
                Draft description: <br />
                {this.randomize === 'Random' ? 'Teams are drafted randomly.' : ''}
                {this.randomize === 'Seeded'
                  ? 'Seeded drafting sorts teams based on a prerequisite, and match teams up aginst each other based on it. E.g. in a tournament of 16: seed 1 would face seed 16 in the first round. Seed 2 would face seed 15. And so on.'
                  : ''}
              </Card>
            </Column>
          </Row>
          <br />
        </Card>
        <Card subtitle="Choose competing teams">
          <Row>
            <Form.Label>Select {this.selectedCount} teams from the list:</Form.Label>
          </Row>
          <Card>
            <Column>
              {this.selectabeTeams.map((team) => (
                <Form.Check key={team.id + team.name} id={`Team` + team.id} value={team.name} />
              ))}
            </Column>
          </Card>
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
    teamStore.getTeams().then(() => {
      this.selectabeTeams = teamStore.teams;
    });
    tournamentStore.tournament = {
      id: 0,
      name: '',
      type: '',
      number_of_teams: 0,
    };
    tournamentStore.getTournaments();
  }

  // Function to randomize the order of teams in the array newTeams.
  shuffle(teams) {
    let currentIndex = teams.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [teams[currentIndex], teams[randomIndex]] = [teams[randomIndex], teams[currentIndex]];
    }
    return teams;
  }

  onlySpaces(string) {
    return string.trim().length === 0;
  }

  save() {
    this.format = document.getElementById('tournamentFormat').value;
    this.selectedCount = document.getElementById('numberOfTeams').value;
    this.randomize = document.getElementById('drafting').value;

    const newTeams = [];
    teamStore.teams.map((team) => {
      if (document.getElementById(`Team` + team.id).checked == true) {
        newTeams.push(team.id);
      }
    });

    // Alerts if imputs are problematic.
    if (
      !tournamentStore.tournament.name ||
      this.onlySpaces(tournamentStore.tournament.name) == true
    ) {
      Alert.info(`Please add a tournament name.`);
      return null;
    }
    if (this.format == 'Choose...') {
      Alert.info(`Please select a tournament format.`);
      return null;
    }
    if (this.selectedCount == 'Choose...') {
      Alert.info(`Please select the number of teams.`);
      return null;
    }
    if (this.randomize == 'Choose...') {
      Alert.info(`Please select type of draft.`);
      return null;
    }
    if (this.selectedCount != newTeams.length) {
      Alert.warning(`There is a mismatch in the numbers of teams selected.
      You have chosen to register a new tournament with ${this.selectedCount} teams, but selected ${newTeams.length} teams.`);
      return null;
    }
    if (this.randomize == 'Random') {
      this.shuffle(newTeams);
    }

    tournamentStore
      .newTournament(tournamentStore.tournament.name, this.format, this.selectedCount)
      .then(() => {
        createGames();
      });
    const createGames = () => {
      const id = tournamentStore.tournament.id;

      if (this.format == 'Single Elimination') {
        if (this.selectedCount == 16) {
          gameStore.newGame(id, 'Round of 16, Game 1', newTeams[0], newTeams[15]);
          gameStore.newGame(id, 'Round of 16, Game 2', newTeams[7], newTeams[8]);
          gameStore.newGame(id, 'Round of 16, Game 3', newTeams[4], newTeams[11]);
          gameStore.newGame(id, 'Round of 16, Game 4', newTeams[3], newTeams[12]);
          gameStore.newGame(id, 'Round of 16, Game 5', newTeams[2], newTeams[13]);
          gameStore.newGame(id, 'Round of 16, Game 6', newTeams[5], newTeams[10]);
          gameStore.newGame(id, 'Round of 16, Game 7', newTeams[6], newTeams[9]);
          gameStore.newGame(id, 'Round of 16, Game 8', newTeams[1], newTeams[14]);
          gameStore.newGame(id, 'Quarterfinals 1', null, null);
          gameStore.newGame(id, 'Quarterfinals 2', null, null);
          gameStore.newGame(id, 'Quarterfinals 3', null, null);
          gameStore.newGame(id, 'Quarterfinals 4', null, null);
          gameStore.newGame(id, 'Semifinals 1', null, null);
          gameStore.newGame(id, 'Semifinals 2', null, null);
          gameStore.newGame(id, 'Finals', null, null);
        }
        if (this.selectedCount == 8) {
          gameStore.newGame(id, 'Quarterfinals 1', newTeams[0], newTeams[7]);
          gameStore.newGame(id, 'Quarterfinals 2', newTeams[3], newTeams[4]);
          gameStore.newGame(id, 'Quarterfinals 3', newTeams[2], newTeams[5]);
          gameStore.newGame(id, 'Quarterfinals 4', newTeams[1], newTeams[6]);
          gameStore.newGame(id, 'Semifinals 1', null, null);
          gameStore.newGame(id, 'Semifinals 2', null, null);
          gameStore.newGame(id, 'Finals', null, null);
        }
        if (this.selectedCount == 4) {
          gameStore.newGame(id, 'Semifinals 1', newTeams[0], newTeams[3]);
          gameStore.newGame(id, 'Semifinals 2', newTeams[1], newTeams[2]);
          gameStore.newGame(id, 'Finals', null, null);
        }
      }
      if (this.format == 'Double Elimination') {
        if (this.selectedCount == 16) {
          gameStore.newGame(id, 'Upper Round of 16, Game 1', newTeams[0], newTeams[15]);
          gameStore.newGame(id, 'Upper Round of 16, Game 2', newTeams[7], newTeams[8]);
          gameStore.newGame(id, 'Upper Round of 16, Game 3', newTeams[4], newTeams[11]);
          gameStore.newGame(id, 'Upper Round of 16, Game 4', newTeams[3], newTeams[12]);
          gameStore.newGame(id, 'Upper Round of 16, Game 5', newTeams[2], newTeams[13]);
          gameStore.newGame(id, 'Upper Round of 16, Game 6', newTeams[5], newTeams[10]);
          gameStore.newGame(id, 'Upper Round of 16, Game 7', newTeams[6], newTeams[9]);
          gameStore.newGame(id, 'Upper Round of 16, Game 8', newTeams[1], newTeams[14]);
          gameStore.newGame(id, 'Lower Round of 16, Game 1', null, null);
          gameStore.newGame(id, 'Lower Round of 16, Game 2', null, null);
          gameStore.newGame(id, 'Lower Round of 16, Game 3', null, null);
          gameStore.newGame(id, 'Lower Round of 16, Game 4', null, null);

          gameStore.newGame(id, 'Upper Quarterfinals 1', null, null);
          gameStore.newGame(id, 'Upper Quarterfinals 2', null, null);
          gameStore.newGame(id, 'Upper Quarterfinals 3', null, null);
          gameStore.newGame(id, 'Upper Quarterfinals 4', null, null);
          gameStore.newGame(id, 'Lower Quarterfinals 1', null, null);
          gameStore.newGame(id, 'Lower Quarterfinals 2', null, null);
          gameStore.newGame(id, 'Lower Quarterfinals 3', null, null);
          gameStore.newGame(id, 'Lower Quarterfinals 4', null, null);

          gameStore.newGame(id, 'Upper Semifinals 1', null, null);
          gameStore.newGame(id, 'Upper Semifinals 2', null, null);
          gameStore.newGame(id, 'Lower Semifinals 1', null, null);
          gameStore.newGame(id, 'Lower Semifinals 2', null, null);
          gameStore.newGame(id, 'Lower Semifinals 3', null, null);
          gameStore.newGame(id, 'Lower Semifinals 4', null, null);

          gameStore.newGame(id, 'Upper Finals', null, null);
          gameStore.newGame(id, 'Lower Finals 1', null, null);
          gameStore.newGame(id, 'Lower Finals 2', null, null);

          gameStore.newGame(id, 'Grand Finals', null, null);
          gameStore.newGame(id, 'Grand Finals Bracket Reset', null, null);
        }
        if (this.selectedCount == 8) {
          gameStore.newGame(id, 'Upper Quarterfinals 1', newTeams[0], newTeams[7]);
          gameStore.newGame(id, 'Upper Quarterfinals 2', newTeams[3], newTeams[4]);
          gameStore.newGame(id, 'Upper Quarterfinals 3', newTeams[2], newTeams[5]);
          gameStore.newGame(id, 'Upper Quarterfinals 4', newTeams[1], newTeams[6]);

          gameStore.newGame(id, 'Upper Semifinals 1', null, null);
          gameStore.newGame(id, 'Upper Semifinals 2', null, null);
          gameStore.newGame(id, 'Lower Semifinals 1', null, null);
          gameStore.newGame(id, 'Lower Semifinals 2', null, null);
          gameStore.newGame(id, 'Lower Semifinals 3', null, null);
          gameStore.newGame(id, 'Lower Semifinals 4', null, null);

          gameStore.newGame(id, 'Upper Finals', null, null);
          gameStore.newGame(id, 'Lower Finals 1', null, null);
          gameStore.newGame(id, 'Lower Finals 2', null, null);

          gameStore.newGame(id, 'Grand Finals', null, null);
          gameStore.newGame(id, 'Grand Finals Bracket Reset', null, null);
        }
        if (this.selectedCount == 4) {
          gameStore.newGame(id, 'Upper Semifinals 1', newTeams[0], newTeams[3]);
          gameStore.newGame(id, 'Upper Semifinals 2', newTeams[1], newTeams[2]);

          gameStore.newGame(id, 'Upper Finals', null, null);
          gameStore.newGame(id, 'Lower Finals 1', null, null);
          gameStore.newGame(id, 'Lower Finals 2', null, null);

          gameStore.newGame(id, 'Grand Finals', null, null);
          gameStore.newGame(id, 'Grand Finals Bracket Reset', null, null);
        }
      }
    };

    Alert.success(`Tournament "${tournamentStore.tournament.name}" generated.`);
    history.push('/tournaments');
  }

  // Reset the values in all input fields
  reset() {
    tournamentStore.tournament.name = '';
    this.format = null;
    this.randomize = null;
    document.getElementById('tournamentFormat').value = 'Choose...';
    document.getElementById('numberOfTeams').value = 'Choose...';
    document.getElementById('drafting').value = 'Choose...';
    teamStore.teams.forEach((team) => {
      document.getElementById('Team' + team.id).checked = false;
    });
  }

  cancel() {
    history.push('/new');
  }
}

export default RegisterTournament;
