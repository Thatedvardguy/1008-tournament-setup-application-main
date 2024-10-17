import * as React from 'react';
import { Alert, Card, Row, Column, Button } from './widgets';
import { teamStore, gameStore, tournamentStore, playerStore } from './stores';

//////////////////////
// Render Game Info //
//////////////////////

class GameDetails extends React.Component {
  winnerid = this.props.gameinfo.winner_id;
  loserid = null;

  team1_score = this.props.gameinfo.team1_score;
  team2_score = this.props.gameinfo.team2_score;

  state = {
    team1_score: this.team1_score,
    team2_score: this.team2_score,
  };

  updateScore1 = () => {
    return this.state.team1_score.toLocaleString(undefined, this.team1_score);
  };
  updateScore2 = () => {
    return this.state.team2_score.toLocaleString(undefined, this.team2_score);
  };
  renderScore = () => {
    this.setState({
      team1_score: this.team1_score,
      team2_score: this.team2_score,
    });
  };

  indexOfGame(round) {
    return gameStore.games.find((game) => game.round === round);
  }

  nameOfTeam(id) {
    return teamStore.teams.find((team) => team.id === id);
  }

  render() {
    return (
      <Card>
        <Column center>
          <u>{this.props.round}</u>
        </Column>
        <Row>
          <Column width={4} center>
            {!this.props.team1 ? 'TBD' : <b>{this.props.team1.name}</b>}
          </Column>
          <Column width={1} center>
            <b>{!this.props.team1 ? '' : this.updateScore1()}</b>
          </Column>
          <Column center>vs</Column>
          <Column width={1} center>
            <b>{!this.props.team2 ? '' : this.updateScore2()}</b>
          </Column>
          <Column width={4} center>
            {!this.props.team2 ? 'TBD' : <b>{this.props.team2.name}</b>}
          </Column>
          <br />
        </Row>

        {(this.winnerid == null && this.props.team1 && this.props.team2) ||
        (this.props.edit === true && this.props.team1 && this.props.team2) ? (
          <Row>
            <Column width={4}>
              <Button.SmallInfo
                onClick={() => {
                  if (this.team1_score < 0 || this.team1_score > 999) {
                    Alert.warning(`Score must be within allowed parameters (0-999)`);
                    return null;
                  }
                  if (this.team2_score < 0 || this.team2_score > 999) {
                    Alert.warning(`Score must be within allowed parameters (0-999)`);
                    return null;
                  }
                  this.renderScore();
                  gameStore.game.team1_score = this.team1_score;
                  gameStore.game.team2_score = this.team2_score;
                  gameStore.game.id = this.props.gameinfo.id;
                  gameStore.updateGameScore();
                }}
              >
                {this.props.edit === false ? 'Update' : 'Update Score'}
              </Button.SmallInfo>
            </Column>
            <Column width={2} center>
              <input
                type="number"
                onChange={(event) => (this.team1_score = event.currentTarget.value)}
                min={0}
                max={999}
                style={{ width: '50px' }}
                defaultValue={this.props.gameinfo.team1_score}
              />
            </Column>
            <Column width={2} center>
              <input
                type="number"
                onChange={(event) => (this.team2_score = event.currentTarget.value)}
                min={0}
                max={999}
                style={{ width: '50px' }}
                defaultValue={this.props.gameinfo.team2_score}
              />
            </Column>
            {this.props.edit === false ? (
              <Column width={4} right>
                <Button.SmallSuccess
                  onClick={() => {
                    if (this.team1_score < 0 || this.team1_score > 999) {
                      Alert.warning(`Score must be within allowed parameters (0-999)`);
                      return null;
                    }
                    if (this.team2_score < 0 || this.team2_score > 999) {
                      Alert.warning(`Score must be within allowed parameters (0-999)`);
                      return null;
                    }
                    this.renderScore();
                    if (this.team1_score === this.team2_score) {
                      Alert.warning(`The match must have a winner to be completed.`);
                      return null;
                    }
                    gameStore.game.team1_score = this.team1_score;
                    gameStore.game.team2_score = this.team2_score;
                    gameStore.game.id = this.props.gameinfo.id;
                    gameStore.updateGameScore().then(() => {
                      this.nextGame();
                      this.props.rerender();
                    });
                  }}
                >
                  Complete
                </Button.SmallSuccess>
              </Column>
            ) : (
              ' '
            )}
          </Row>
        ) : (
          ''
        )}
      </Card>
    );
  }

  nextGame = () => {
    this.winnerid = null;
    if (parseInt(this.team1_score) > parseInt(this.team2_score)) {
      this.winnerid = this.props.team1.id;
      this.loserid = this.props.team2.id;
    }
    if (parseInt(this.team1_score) < parseInt(this.team2_score)) {
      this.winnerid = this.props.team2.id;
      this.loserid = this.props.team1.id;
    }
    gameStore.game.winner_id = this.winnerid;
    gameStore.updateGameWinner();

    ////////////////////////// Single Elimination /////////////////////////
    ////////////////////////////// All games //////////////////////////////

    if (this.props.gameinfo.round == 'Round of 16, Game 1') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Quarterfinals 1').id);
    }
    if (this.props.gameinfo.round == 'Round of 16, Game 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Quarterfinals 1').id);
    }
    if (this.props.gameinfo.round == 'Round of 16, Game 3') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Quarterfinals 2').id);
    }
    if (this.props.gameinfo.round == 'Round of 16, Game 4') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Quarterfinals 2').id);
    }
    if (this.props.gameinfo.round == 'Round of 16, Game 5') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Quarterfinals 3').id);
    }
    if (this.props.gameinfo.round == 'Round of 16, Game 6') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Quarterfinals 3').id);
    }
    if (this.props.gameinfo.round == 'Round of 16, Game 7') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Quarterfinals 4').id);
    }
    if (this.props.gameinfo.round == 'Round of 16, Game 8') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Quarterfinals 4').id);
    }
    if (this.props.gameinfo.round == 'Quarterfinals 1') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Semifinals 1').id);
    }
    if (this.props.gameinfo.round == 'Quarterfinals 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Semifinals 1').id);
    }
    if (this.props.gameinfo.round == 'Quarterfinals 3') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Semifinals 2').id);
    }
    if (this.props.gameinfo.round == 'Quarterfinals 4') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Semifinals 2').id);
    }
    if (this.props.gameinfo.round == 'Semifinals 1') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Finals').id);
    }
    if (this.props.gameinfo.round == 'Semifinals 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Finals').id);
    }
    if (this.props.gameinfo.round == 'Finals') {
      Alert.success(
        `We have a winner! "${this.nameOfTeam(this.winnerid).name}" is the champion of ${
          this.props.tournamentinfo.name
        }!`
      );
      tournamentStore.tournament.id = this.props.tournamentinfo.id;
      tournamentStore.tournament.winner_id = this.winnerid;
      tournamentStore.updateTournamentWinner();
    }

    ////////////////////////// Double Elimination /////////////////////////
    ////////////////////////////// Game 1 - 12 ////////////////////////////

    if (this.props.gameinfo.round == 'Upper Round of 16, Game 1') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Upper Quarterfinals 1').id);
      gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Round of 16, Game 1').id);
    }
    if (this.props.gameinfo.round == 'Upper Round of 16, Game 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Upper Quarterfinals 1').id);
      gameStore.updateGameTeam2(this.loserid, this.indexOfGame('Lower Round of 16, Game 1').id);
    }
    if (this.props.gameinfo.round == 'Upper Round of 16, Game 3') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Upper Quarterfinals 2').id);
      gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Round of 16, Game 2').id);
    }
    if (this.props.gameinfo.round == 'Upper Round of 16, Game 4') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Upper Quarterfinals 2').id);
      gameStore.updateGameTeam2(this.loserid, this.indexOfGame('Lower Round of 16, Game 2').id);
    }
    if (this.props.gameinfo.round == 'Upper Round of 16, Game 5') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Upper Quarterfinals 3').id);
      gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Round of 16, Game 3').id);
    }
    if (this.props.gameinfo.round == 'Upper Round of 16, Game 6') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Upper Quarterfinals 3').id);
      gameStore.updateGameTeam2(this.loserid, this.indexOfGame('Lower Round of 16, Game 3').id);
    }
    if (this.props.gameinfo.round == 'Upper Round of 16, Game 7') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Upper Quarterfinals 4').id);
      gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Round of 16, Game 4').id);
    }
    if (this.props.gameinfo.round == 'Upper Round of 16, Game 8') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Upper Quarterfinals 4').id);
      gameStore.updateGameTeam2(this.loserid, this.indexOfGame('Lower Round of 16, Game 4').id);
    }
    if (this.props.gameinfo.round == 'Lower Round of 16, Game 1') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Quarterfinals 1').id);
    }
    if (this.props.gameinfo.round == 'Lower Round of 16, Game 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Quarterfinals 2').id);
    }
    if (this.props.gameinfo.round == 'Lower Round of 16, Game 3') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Quarterfinals 3').id);
    }
    if (this.props.gameinfo.round == 'Lower Round of 16, Game 4') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Quarterfinals 4').id);
    }

    ////////////////////////// Double Elimination /////////////////////////
    ///////////////////////////// Game 13 - 20 ////////////////////////////

    if (this.props.gameinfo.round == 'Upper Quarterfinals 1') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Upper Semifinals 1').id);
      if (this.props.tournamentinfo.number_of_teams == 16) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Quarterfinals 1').id);
      }
      if (this.props.tournamentinfo.number_of_teams == 8) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Semifinals 1').id);
      }
    }
    if (this.props.gameinfo.round == 'Upper Quarterfinals 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Upper Semifinals 1').id);
      if (this.props.tournamentinfo.number_of_teams == 16) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Quarterfinals 2').id);
      }
      if (this.props.tournamentinfo.number_of_teams == 8) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Semifinals 2').id);
      }
    }
    if (this.props.gameinfo.round == 'Upper Quarterfinals 3') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Upper Semifinals 2').id);
      if (this.props.tournamentinfo.number_of_teams == 16) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Quarterfinals 3').id);
      }
      if (this.props.tournamentinfo.number_of_teams == 8) {
        gameStore.updateGameTeam2(this.loserid, this.indexOfGame('Lower Semifinals 1').id);
      }
    }
    if (this.props.gameinfo.round == 'Upper Quarterfinals 4') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Upper Semifinals 2').id);
      if (this.props.tournamentinfo.number_of_teams == 16) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Quarterfinals 4').id);
      }
      if (this.props.tournamentinfo.number_of_teams == 8) {
        gameStore.updateGameTeam2(this.loserid, this.indexOfGame('Lower Semifinals 2').id);
      }
    }
    if (this.props.gameinfo.round == 'Lower Quarterfinals 1') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Lower Semifinals 1').id);
    }
    if (this.props.gameinfo.round == 'Lower Quarterfinals 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Semifinals 1').id);
    }
    if (this.props.gameinfo.round == 'Lower Quarterfinals 3') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Lower Semifinals 2').id);
    }
    if (this.props.gameinfo.round == 'Lower Quarterfinals 4') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Semifinals 2').id);
    }

    ////////////////////////// Double Elimination /////////////////////////
    ///////////////////////////// Game 21 - 26 ////////////////////////////

    if (this.props.gameinfo.round == 'Upper Semifinals 1') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Upper Finals').id);
      if (
        this.props.tournamentinfo.number_of_teams == 16 ||
        this.props.tournamentinfo.number_of_teams == 8
      ) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Semifinals 3').id);
      }
      if (this.props.tournamentinfo.number_of_teams == 4) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Finals 1').id);
      }
    }
    if (this.props.gameinfo.round == 'Upper Semifinals 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Upper Finals').id);
      if (
        this.props.tournamentinfo.number_of_teams == 16 ||
        this.props.tournamentinfo.number_of_teams == 8
      ) {
        gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Semifinals 4').id);
      }
      if (this.props.tournamentinfo.number_of_teams == 4) {
        gameStore.updateGameTeam2(this.loserid, this.indexOfGame('Lower Finals 1').id);
      }
    }
    if (this.props.gameinfo.round == 'Lower Semifinals 1') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Semifinals 3').id);
    }
    if (this.props.gameinfo.round == 'Lower Semifinals 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Semifinals 4').id);
    }
    if (this.props.gameinfo.round == 'Lower Semifinals 3') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Lower Finals 1').id);
    }
    if (this.props.gameinfo.round == 'Lower Semifinals 4') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Finals 1').id);
    }

    ////////////////////////// Double Elimination /////////////////////////
    ///////////////////////////// Game 27 - 29 ////////////////////////////

    if (this.props.gameinfo.round == 'Upper Finals') {
      gameStore.updateGameTeam1(this.winnerid, this.indexOfGame('Grand Finals').id);
      gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Lower Finals 2').id);
    }
    if (this.props.gameinfo.round == 'Lower Finals 1') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Lower Finals 2').id);
    }
    if (this.props.gameinfo.round == 'Lower Finals 2') {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Grand Finals').id);
    }

    ////////////////////////// Double Elimination /////////////////////////
    ///////////////////////////// Game 30 - 31 ////////////////////////////

    if (this.props.gameinfo.round == 'Grand Finals' && this.team1_score < this.team2_score) {
      gameStore.updateGameTeam2(this.winnerid, this.indexOfGame('Grand Finals Bracket Reset').id);
      gameStore.updateGameTeam1(this.loserid, this.indexOfGame('Grand Finals Bracket Reset').id);
    }
    if (this.props.gameinfo.round == 'Grand Finals' && this.team1_score > this.team2_score) {
      Alert.success(
        `We have a winner! "${this.nameOfTeam(this.winnerid).name}" is the champion of ${
          this.props.tournamentinfo.name
        }!`
      );
      tournamentStore.tournament.id = this.props.tournamentinfo.id;
      tournamentStore.tournament.winner_id = this.winnerid;
      tournamentStore.updateTournamentWinner();
    }
    if (this.props.gameinfo.round == 'Grand Finals Bracket Reset') {
      Alert.success(
        `We have a winner! "${this.nameOfTeam(this.winnerid).name}" is the champion of ${
          this.props.tournamentinfo.name
        }!`
      );
      tournamentStore.tournament.id = this.props.tournamentinfo.id;
      tournamentStore.tournament.winner_id = this.winnerid;
      tournamentStore.updateTournamentWinner();
    }
  };
}

export default GameDetails;
