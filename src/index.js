import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { showService } from './services';
import { Alert, Card, Row, Column, NavBar, Button, Form } from './widgets';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Home Screen">
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return(
      <div>
        <Card title="Welcome">Welcome to the Show</Card>;
        <ShowList />
      </div>
    )
  }
}

class ShowList extends Component {
  shows = [];

  render() {
    return (
      <Card title="Shows">
        {this.shows.map((show) => (
          <Row key={show.id}>
            <Column>
              <NavLink to={'/shows/' + show.id}>{show.title}</NavLink>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }

  mounted() {
    (async () =>{
      let res = await showService.getShows().catch(err => console.error(err));
      this.shows = res;
    })();
  }
}

class ShowDetails extends Component {
  show = null;

  render() {
    if (!this.show) return null;

    return (
      <div>
        <Card title="Show details">
          <Row>
            <Column width={2}>Title:</Column>
            <Column>{this.show.title}</Column>
          </Row>
          <Row>
            <Column width={2}>Description:</Column>
            <Column>{this.show.description}</Column>
          </Row>
        </Card>
        <Button.Light onClick={this.edit}>Edit</Button.Light>
      </div>
    );
  }

  mounted() {
    let id = this.props.match.params.id;
    console.log(id);
    (async () =>{
      const res = await showService.getShow(id);
      this.show = res;
    })();
  }

  edit() {
    history.push('/shows/' + this.show.id + '/edit');
  }
}

class ShowEdit extends Component {
  show = null;

  render() {
    if (!this.show) return null;

    return (
      <div>
        <Card title="Edit show">
          <Form.Label>Title:</Form.Label>
          <Form.Input
            type="text"
            value={this.show.title}
            onChange={(event) => (this.show.title = event.currentTarget.value)}
          />
          <Form.Label>Description:</Form.Label>
          <Form.Input
            type="text"
            value={this.show.description}
            onChange={(event) => (this.show.description = event.currentTarget.value)}
          />
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </div>
    );
  }

  mounted() {
    let id = this.props.match.params.id;
    (async () => {
      const res = await showService.getShow(id);
      this.show = res;
      })();
    }

  save() {
    studentService.updateStudent(this.student, () => {
      history.push('/students/' + this.props.match.params.id);
    });
  }

  cancel() {
    history.push('/students/' + this.props.match.params.id);
  }
}

ReactDOM.render(
  <div>
    <Alert />
    <HashRouter>
      <div>
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/shows" component={ShowList} />
        <Route exact path="/shows/:id" component={ShowDetails} />
        <Route exact path="/shows/:id/edit" component={ShowEdit} />
      </div>
    </HashRouter>
  </div>,
  document.getElementById('root')
);
