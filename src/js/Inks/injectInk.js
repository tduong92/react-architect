import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TransitionGroup from 'react-addons-transition-group';

import { LEFT_MOUSE } from '../constants/keyCodes';
import InkTransition from './InkTransition';
import { getOffset } from '../utils';

/**
 * Takes any component and injects an ink container along with event
 * listeners for handling those inks. It also injects a prop
 * named `ink` which needs to be added to the ComposedComponent.
 *
 * @param ComposedComponent the component to compose with the ink functionality.
 * @return the ComposedComponent with inks.
 */
export default ComposedComponent => class Ink extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      inks: [],
    };
  }

  static propTypes = {
    onMouseUp: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchCancel: PropTypes.func,
    disabled: PropTypes.bool,
    inkDisabled: PropTypes.bool,
    children: PropTypes.node,
  };

  calcR = (a, b) => {
    return Math.sqrt((a * a) + (b * b));
  };

  invalidClickEvent = ({ button, ctrlKey }) => {
    return button !== LEFT_MOUSE || ctrlKey;
  };

  createInk = (pageX, pageY) => {
    const container = ReactDOM.findDOMNode(this).querySelector('.md-ink-container');

    let left = 0, top = 0;
    let size, x, y;
    if(typeof pageX !== 'undefined' && typeof pageY !== 'undefined') {
      const offset = getOffset(container);

      x = pageX - offset.left;
      y = pageY - offset.top;
    } else {
      const node = container.parentNode;
      x = node.offsetWidth / 2;
      y = node.offsetHeight / 2;
    }

    const { offsetWidth, offsetHeight } = container;
    const r = Math.max(
      this.calcR(x, y),
      this.calcR(offsetWidth - x, y),
      this.calcR(offsetWidth - x, offsetHeight - y),
      this.calcR(x, offsetHeight - y)
    );

    left = x - r;
    top = y - r;
    size = r * 2;

    const ink = {
      style: {
        left,
        top,
        width: size,
        height: size,
      },
      time: new Date(),
    };
    this.setState({
      inks: [
        ...this.state.inks,
        ink,
      ],
    });
  };

  popInk = () => {
    if(!this.state.inks.length) { return; }
    let inks = this.state.inks.slice();
    inks.pop();
    this.setState({ inks });
  };

  disabled = () => {
    return this.props.disabled || this.props.inkDisabled;
  };

  handleMouseDown = (e) => {
    this.props.onMouseDown && this.props.onMouseDown(e);
    const nextState = { skipFocus: true };
    if(!this.invalidClickEvent(e)) {
      e.stopPropagation();
      this.createInk(e.pageX, e.pageY);
      nextState.skipMouseUp = false;
    }

    this.setState(nextState);
  };

  handleMouseLeave = (e) => {
    this.props.onMouseLeave && this.props.onMouseLeave(e);

    this.popInk();
    this.setState({ skipMouseUp: true });
  };

  handleMouseUp = (e) => {
    this.props.onMouseUp && this.props.onMouseUp(e);
    if(this.invalidClickEvent(e) || this.state.skipMouseUp) { return; }
    this.popInk();
    this.setState({ skipFocus: false });
  };

  handleTouchStart = (e) => {
    this.props.onTouchStart && this.props.onTouchStart(e);

    e.stopPropagation();
    const { pageX, pageY } = e.changedTouches[0];
    this.createInk(pageX, pageY);
    this.setState({ skipFocus: true });
  };

  handleTouchEnd = (e) => {
    this.props.onTouchEnd && this.props.onTouchEnd(e);
    this.popInk();
  };

  handleTouchCancel = (e) => {
    this.props.onTouchCancel && this.props.onTouchCancel(e);
    this.popInk();
  };

  handleBlur = (e) => {
    this.props.onBlur && this.props.onBlur(e);
    this.popInk();
  };

  handleFocus = (e) => {
    this.props.onFocus && this.props.onFocus(e);
    if(this.state.skipFocus) { return; }
    e.stopPropagation();

    this.createInk();
  };

  render() {
    const { children, inkDisabled, ...props } = this.props;

    // Don't inject ink and new props if disabled
    if(this.disabled()) {
      return <ComposedComponent {...props} children={children} />;
    }

    const ink = (
      <TransitionGroup className="md-ink-container" key="ink-container">
        {this.state.inks.map(ink => <InkTransition key={ink.time.getTime()} {...ink} />)}
      </TransitionGroup>
    );

    return (
      <ComposedComponent
        {...props}
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseLeave}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onTouchStart={this.handleTouchStart}
        onTouchCancel={this.handleTouchCancel}
        onTouchEnd={this.handleTouchEnd}
        ink={ink}
      >
        {children}
      </ComposedComponent>
    );
  }
};
