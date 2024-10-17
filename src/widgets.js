import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

/**
 * Renders an information card using Bootstrap classes
 *
 * Properties: title
 */
export class Card extends Component {
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{this.props.title}</h2>
          <h5 className="card-subtitle">{this.props.subtitle}</h5>
          <div className="card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

/**
 * Renders a row using Bootstrap classes.
 */
export class Row extends Component {
  render() {
    return (
      <div className={'row' + (this.props.center ? 'text-center' : '')}>{this.props.children}</div>
    );
  }
}

/**
 * Renders a column with specified width using Bootstrap classes.
 *
 * Properties: width, right
 */
export class Column extends Component {
  render() {
    return (
      <div className={'col' + (this.props.width ? '-' + this.props.width : '')}>
        <div className={this.props.center ? 'text-center' : ''}>
          <div className={this.props.right ? 'float-end' : ''}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

/**
 * Renders a primary button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonPrimary extends Component {
  render() {
    return (
      <button type="button" className="btn btn-primary" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a secondary button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonSecondary extends Component {
  render() {
    return (
      <button type="button" className="btn btn-secondary" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a success button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonSuccess extends Component {
  render() {
    return (
      <button type="button" className="btn btn-success" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a snaller success button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonSmallSuccess extends Component {
  render() {
    return (
      <button type="button" className="btn btn-success btn-sm" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a danger button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonDanger extends Component {
  render() {
    return (
      <button type="button" className="btn btn-danger" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a warning button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonWarning extends Component {
  render() {
    return (
      <button type="button" className="btn btn-warning" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a info button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonInfo extends Component {
  render() {
    return (
      <button type="button" className="btn btn-info" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a smaller info button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonSmallInfo extends Component {
  render() {
    return (
      <button type="button" className="btn btn-info btn-sm" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a light button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonLight extends Component {
  render() {
    return (
      <button type="button" className="btn btn-light" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a dark button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonDark extends Component {
  render() {
    return (
      <button type="button" className="btn btn-dark" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a link button using Bootstrap styles.
 *
 * Properties: onClick
 */
class ButtonLink extends Component {
  render() {
    return (
      <button type="button" className="btn btn-link" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * Renders a button using Bootstrap styles.
 *
 * Properties: onClick
 */
export class Button {
  static Primary = ButtonPrimary;
  static Secondary = ButtonSecondary;
  static Success = ButtonSuccess;
  static SmallSuccess = ButtonSmallSuccess;
  static Danger = ButtonDanger;
  static Warning = ButtonWarning;
  static Info = ButtonInfo;
  static SmallInfo = ButtonSmallInfo;
  static Light = ButtonLight;
  static Dark = ButtonDark;
  static Link = ButtonLink;
}

/**
 * Renders a NavBar link using Bootstrap styles.
 *
 * Properties: to
 */
class NavBarLink extends Component {
  render() {
    return (
      <NavLink className="nav-link" activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}

/**
 * Renders a NavBar using Bootstrap classes.
 *
 * Properties: brand
 */
export class NavBar extends Component {
  static Link = NavBarLink;

  render() {
    return (
      <nav className="navbar sticky-top navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid justify-content-start">
          <NavLink className="navbar-brand" activeClassName="active" exact to="/">
            {this.props.brand}
          </NavLink>
          <div className="navbar-nav">{this.props.children}</div>
        </div>
      </nav>
    );
  }
}

/**
 * Renders a form label using Bootstrap styles.
 */
class FormLabel extends Component {
  render() {
    return <label className="col-form-label">{this.props.children}</label>;
  }
}

/**
 * Renders a form input using Bootstrap styles.
 *
 * Properties: type, id, value, placeholder, onChange, required, pattern, min, max
 */
class FormInput extends Component {
  render() {
    return (
      <input
        className="form-control"
        type={this.props.type}
        id={this.props.id}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        required={this.props.required}
        pattern={this.props.pattern}
        min={this.props.min}
        max={this.props.max}
        maxLength="99"
      />
    );
  }
}

/**
 * Renders a select input  with 2 values using Bootstrap styles.
 */
class FormSelect2 extends Component {
  render() {
    return (
      <div>
        <select className="select" id={this.props.id} onChange={this.props.onChange}>
          <option defaultValue={1} hidden>
            Choose...
          </option>
          <option value1={this.props.value1}>{this.props.value1}</option>
          <option value2={this.props.value2}>{this.props.value2}</option>
        </select>
      </div>
    );
  }
}

/**
 * Renders a select input with 3 values using Bootstrap styles.
 */
class FormSelect3 extends Component {
  render() {
    return (
      <div>
        <select className="select" id={this.props.id} onChange={this.props.onChange}>
          <option defaultValue={1} hidden>
            Choose...
          </option>
          <option value1={this.props.value1}>{this.props.value1}</option>
          <option value2={this.props.value2}>{this.props.value2}</option>
          <option value3={this.props.value3}>{this.props.value3}</option>
        </select>
      </div>
    );
  }
}

/**
 * Renders a select checkbox using Bootstrap styles.
 */
class FormCheck extends Component {
  render() {
    return (
      <div>
        <input type="checkbox" id={this.props.id} className="btn-check" autoComplete="off" />
        <label className="btn btn-outline-secondary" htmlFor={this.props.id}>
          {this.props.value}
        </label>
      </div>
    );
  }
}

/**
 * Renders form components using Bootstrap styles.
 */
export class Form {
  static Label = FormLabel;
  static Input = FormInput;
  static Select2 = FormSelect2;
  static Select3 = FormSelect3;
  static Check = FormCheck;
}

/**
 * Renders alert messages using Bootstrap classes.
 *
 * Students: this slightly more complex component is not part of curriculum.
 */
export class Alert extends Component {
  alerts = [];
  nextId = 0;

  render() {
    return (
      <div>
        {this.alerts.map((alert, i) => (
          <div
            key={alert.id}
            className={'alert fixed-bottom alert-dismissible alert-' + alert.type}
            role="alert"
          >
            {alert.text}
            <button
              type="button"
              className="btn-close btn-sm"
              onClick={() => this.alerts.splice(i, 1)}
            />
          </div>
        ))}
      </div>
    );
  }

  /**
   * Show success alert.
   */
  static success(text) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'success' });
    });
  }

  /**
   * Show info alert.
   */
  static info(text) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'info' });
    });
  }

  /**
   * Show warning alert.
   */
  static warning(text) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'warning' });
    });
  }

  /**
   * Show danger alert.
   */
  static danger(text) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      let instance = Alert.instance(); // Get rendered Alert component instance
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'danger' });
    });
  }
}
