import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { Alert, Card, Row, Column, NavBar, Button, Form } from './widgets';
import { createHashHistory } from 'history';
import TournamentDetails from './TournamentDetails';
import TournamentEdit from './TournamentEdit';
import RegisterTournament from './RegisterTournament';
import TeamDetails from './TeamDetails';
import TeamEdit from './TeamEdit';
import RegisterTeam from './RegisterTeam';
import { teamStore, gameStore, tournamentStore, playerStore, createDatabase } from './stores';

export const history = createHashHistory();

////////////////////////
// Top navigation bar //
////////////////////////

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Home">
        <Row>
          <Column>
            <NavBar.Link to="/tournaments">Tournaments</NavBar.Link>
          </Column>
          <Column>
            <NavBar.Link to="/teams">Teams</NavBar.Link>
          </Column>
          <Column>
            <NavBar.Link to="/new">New</NavBar.Link>
          </Column>
        </Row>
      </NavBar>
    );
  }
}

///////////////
// Home menu //
///////////////

class Home extends Component {
  render() {
    return (
      <Card>
        <Card title="Tournament generator">
          <Row>
            <br />
          </Row>
          <Row>Welcome to this tournament hosting application!</Row>
          <Row>This application can be used to host and manage tournaments.</Row>
          <Row>Custom teams can also be registered and used in the tournaments.</Row>
          <Row>
            <br />
          </Row>
          <Row>Use the menu bar at the top to navigate the application.</Row>
        </Card>
      </Card>
    );
  }
  mounted() {
    // Create tables in the database from 'mysql-pool.js' if these do not already exist.
    createDatabase.createTournamentDatabase();
    createDatabase.createGameDatabase();
    createDatabase.createTeamDatabase();
    createDatabase.createPlayerDatabase();
  }
}

//////////////////////////
// Tournament main menu //
//////////////////////////

class Tournaments extends Component {
  noTournaments = false;

  render() {
    if (!tournamentStore.tournaments) return null;

    return (
      <Card>
        <Card title="Manage tournaments">
          <Row>Click on the tournament you want to manage</Row>
          <Card>
            {this.noTournaments
              ? `There are no active tournaments in the database. Try creating some!`
              : ''}
            {tournamentStore.tournaments.map((tournament) => (
              <Row key={tournament.id}>
                <Button.Light key={tournament.id}>
                  <NavLink to={'/tournaments/' + tournament.id}>{tournament.name}</NavLink>
                </Button.Light>
              </Row>
            ))}
          </Card>
        </Card>
      </Card>
    );
  }
  mounted() {
    tournamentStore.getTournaments().then(() => {
      if (tournamentStore.tournaments.length === 0) this.noTournaments = true;
    });
  }
}

/////////////////////
// Teams main menu //
/////////////////////

class Teams extends Component {
  noTeams = false;

  render() {
    if (!teamStore.teams) return null;

    return (
      <Card>
        <Card title="Manage teams">
          <Row>Click on the team you want to make changes to</Row>
          <Card>
            {this.noTeams
              ? `There are no registered teams in the database. Try creating some!`
              : ''}
            {teamStore.teams.map((team) => (
              <Row key={team.id}>
                <Button.Light key={team.id}>
                  <NavLink to={'/teams/' + team.id}>{team.name}</NavLink>
                </Button.Light>
              </Row>
            ))}
          </Card>
        </Card>
      </Card>
    );
  }
  mounted() {
    teamStore.getTeams().then(() => {
      if (teamStore.teams.length === 0) this.noTeams = true;
    });
  }
}

///////////////////////
// Registration menu //
///////////////////////

class Registration extends Component {
  render() {
    return (
      <Card>
        <Card title="Add new">
          <Card subtitle="Tournaments:">
            <Column center>
              <Button.Primary onClick={this.tilTurnering}>Create new tournament!</Button.Primary>
            </Column>
          </Card>
          <br />
          <Card subtitle="Teams:">
            <Column center>
              <Button.Primary onClick={this.tilLag}>Create new team!</Button.Primary>
            </Column>
          </Card>
        </Card>
      </Card>
    );
  }

  tilTurnering() {
    history.push('/new/registerTournament');
  }

  tilLag() {
    history.push('/new/registerTeam');
  }
}

//////////////////////////
// DOM rendered in root //
//////////////////////////

ReactDOM.render(
  <div>
    <HashRouter>
      <div>
        <Menu />
        <Alert />
        <Route exact path="/" component={Home} />
        <Route exact path="/tournaments" component={Tournaments} />
        <Route exact path="/tournaments/:id" component={TournamentDetails} />
        <Route exact path="/tournaments/:id/edit" component={TournamentEdit} />
        <Route exact path="/teams" component={Teams} />
        <Route exact path="/teams/:id" component={TeamDetails} />
        <Route exact path="/teams/:id/edit" component={TeamEdit} />
        <Route exact path="/new" component={Registration} />
        <Route exact path="/new/registerTournament" component={RegisterTournament} />
        <Route exact path="/new/registerTeam" component={RegisterTeam} />
      </div>
    </HashRouter>
  </div>,
  document.getElementById('root')
);
