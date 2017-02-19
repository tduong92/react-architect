import React, { PureComponent, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import cn from 'classnames';
import deprecated from 'react-prop-types/lib/deprecated';

import getField from '../utils/getField';
import controlled from '../utils/PropTypes/controlled';
import viewport from '../utils/viewport';
import { TAB } from '../constants/keyCodes';
import AccessibleFakeInkedButton from '../Helpers/AccessibleFakeInkedButton';
import Collapse from '../Helpers/Collapse';
import Collapser from '../FontIcons/Collapser';
import TileAddon from './TileAddon';
import ListItemText from './ListItemText';
import List from './List';

const cascadingStyles = {
  left: {
    right: '100%',
    top: 0,
    position: 'absolute',
  },
  leftReversed: {
    right: '100%',
    bottom: 0,
    position: 'absolute',
  },
  right: {
    left: '100%',
    top: 0,
    position: 'absolute',
  },
  rightReversed: {
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
};

/**
 * The `ListItem` component is used for rendering a `li` tag with text and optional
 * icons/avatars.
 */
export default class ListItem extends PureComponent {
  static propTypes = {
    /**
     * An optional style to apply to the `li` tag.
     */
    style: PropTypes.object,

    /**
     * An optional className to apply to the `li` tag.
     */
    className: PropTypes.string,

    /**
     * An optional style to apply to the `.md-list-tile`.
     *
     * @see {@link #component}
     */
    tileStyle: PropTypes.object,

    /**
     * An optional className to apply to the `.md-list-tile`.
     *
     * @see {@link #component}
     */
    tileClassName: PropTypes.string,

    /**
     * Any additional children to display in the `.md-list-tile`. If you use this prop,
     * you will most likely need to override the `height` for the `.md-list-tile--icon`,
     * `.md-list-tile--avatar`, `.md-list-tile--two-lines`, and/or `.md-list-tile--three-lines`
     * to get it to display correctly unless the children are positioned `absolute`.
     */
    children: PropTypes.node,

    /**
     * Boolean if the `ListItem` is disabled.
     */
    disabled: PropTypes.bool,

    /**
     * An optional tab index for the `.md-list-tile`. If omitted, it will default to the
     * `AccessibleFakeButton`'s `tabIndex` default prop value.
     */
    tabIndex: PropTypes.number,

    /**
     * The primary text to display. This will only be rendered as a single line. Any overflown
     * text will be converted to ellipsis.
     */
    primaryText: PropTypes.node.isRequired,

    /**
     * An optional secondary text to display below the `primaryText`. This can be an additional
     * one or two lines. Like the `primaryText`, and overflown text will be converted to ellipsis.
     *
     * You must set the `threeLines` prop to `true` if you want this to be displayed as two lines.
     */
    secondaryText: PropTypes.node,

    /**
     * An optional `FontIcon` to display to the left of the text.
     */
    leftIcon: PropTypes.node,

    /**
     * Boolean if the list item should be inset as if there is a `leftIcon` or a `leftAvatar`.
     * This is used for some lists where only a parent contains the icon.
     */
    inset: PropTypes.bool,

    /**
     * An optional `Avatar` to display to the left of the text. If you have a mixed `List` of
     * `FontIcon` and `Avatar`, it is recommended to set the `iconSized` prop on the `Avatar` to
     * `true` so that the `Avatar` will be scaled down to the `FontIcon` size.
     */
    leftAvatar: PropTypes.node,

    /**
     * An optional `FontIcon` to display to the right of the text.
     */
    rightIcon: PropTypes.node,

    /**
     * An optional `Avatar` to display to the right of the text. If you have a mixed `List` of
     * `FontIcon` and `Avatar`, it is recommended to set the `iconSized` prop on the `Avatar` to
     * `true` so that the `Avatar` will be scaled down to the `FontIcon` size.
     */
    rightAvatar: PropTypes.node,

    /**
     * Boolean if the `secondaryText` should span two lines instead of one. This will include
     * three lines of text in total when including the `primaryText`.
     */
    threeLines: PropTypes.bool,

    /**
     * The component to render the `.md-list-tile` as. This is mostly useful if you
     * want to use the `ListItem` for navigation and working with the `react-router`'s `Link`
     * component.
     *
     * This prop is **not** the top-most element of the `ListItem` component. To change the
     * top-most element, see the `itemComponent` prop.
     *
     * @see {@link #itemComponent}
     */
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]).isRequired,

    /**
     * The component to render the top-most element of the `ListItem` component. This is the
     * `.md-list-item` and defaults to the `<li>` element.
     *
     * @see {@link #component}
     */
    itemComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]).isRequired,

    /**
     * An optional list of `ListItem`, `ListItemControl`, `Divider`, or `Subheader` components
     * to render in a nested list. This will inject an expander icon to the right of the text
     * in the `.md-list-tile` that rotates 180 degrees when open.
     *
     * The nested items will be visible once the user clicks on the `ListItem`.
     *
     * @see {@link #isOpen]
     */
    nestedItems: PropTypes.arrayOf(PropTypes.node),

    /**
     * Boolean if the `nestedItems` are visible by default.
     */
    defaultOpen: PropTypes.bool,

    /**
     * Boolean if the `nestedItems` are visible. This will make the `nestedItems` controlled
     * and require the `onClick` function to be defined.
     *
     * @see {@link #defaultOpen}
     */
    isOpen: controlled(PropTypes.bool, 'onClick', 'defaultOpen'),

    /**
     * Any children used to render the expander icon.
     */
    expanderIconChildren: PropTypes.node,

    /**
     * An icon className to use to render the expander icon.
     */
    expanderIconClassName: PropTypes.string,

    /**
     * An optional function to call when the `.md-list-tile` is clicked. This is required if the
     * `isOpen` prop is defined.
     */
    onClick: PropTypes.func,

    /**
     * An optional function to call when the `.md-list-tile` triggers the `mouseover` event.
     */
    onMouseOver: PropTypes.func,

    /**
     * An optional function to call when the `.md-list-tile` triggers the `mouseleave` event.
     */
    onMouseLeave: PropTypes.func,

    /**
     * An optional function to call when the `.md-list-tile` triggers the `touchstart` event.
     */
    onTouchStart: PropTypes.func,

    /**
     * An optional function to call when the `.md-list-tile` triggers the `touchend` event.
     */
    onTouchEnd: PropTypes.func,

    /**
     * An optional function to call when the `.md-list-tile` triggers the `keydown` event.
     */
    onKeyDown: PropTypes.func,

    /**
     * An optional function to call when the `.md-list-tile` triggers the `keyup` event.
     */
    onKeyUp: PropTypes.func,

    /**
     * Boolean if the `ListItem` is currently active. This will apply the `activeClassName` prop
     * to the `leftIcon`, `rightIcon`, and the `primaryText`.
     */
    active: PropTypes.bool,

    /**
     * The className to apply to the `leftIcon`, `rightIcon`, and `primaryText` when the `active`
     * prop is `true`.
     */
    activeClassName: PropTypes.string,

    /**
     * Boolean if the nested items should animate when they appear or disappear.
     */
    animateNestedItems: PropTypes.bool,

    /**
     * Defines the number of items in the list. This is only required when all items in the
     * list are not present in the DOM.
     *
     * @see https://www.w3.org/TR/wai-aria/states_and_properties#aria-setsize
     */
    'aria-setsize': PropTypes.number,

    /**
     * Defines the items position in the list. This is only required when all items in the list
     * are not present in the DOM. The custom validation just requires this prop if the `aria-setsize`
     * prop is defined as a helpful reminder.
     *
     * @see https://www.w3.org/TR/wai-aria/states_and_properties#aria-posinset
     */
    'aria-posinset': (props, propName, ...args) => {
      let validator = PropTypes.number;
      if (typeof props['aria-setsize'] !== 'undefined') {
        validator = validator.isRequired;
      }

      return validator(props, propName, ...args);
    },
    initiallyOpen: deprecated(PropTypes.bool, 'Use `defaultOpen` instead'),
  };

  static defaultProps = {
    animateNestedItems: true,
    activeClassName: 'md-text--theme-primary',
    component: 'div',
    itemComponent: 'li',
    expanderIconChildren: 'keyboard_arrow_down',
  };

  static contextTypes = {
    cascading: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      cascadingStyle: cascadingStyles.right,
    };

    if (typeof props.isOpen === 'undefined') {
      this.state.isOpen = typeof props.initiallyOpen !== 'undefined' ? props.initiallyOpen : !!props.defaultOpen;
    }

    this.focus = this.focus.bind(this);
    this._setTile = this._setTile.bind(this);
    this._setContainer = this._setContainer.bind(this);
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleMouseOver = this._handleMouseOver.bind(this);
    this._handleMouseLeave = this._handleMouseLeave.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);
    this._reposition = this._reposition.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    const isOpen = getField(this.props, this.state, 'isOpen');
    const nextOpen = getField(nextProps, nextState, 'isOpen');
    if (!this.context.cascading || isOpen === nextOpen || !nextOpen) {
      return;
    }

    this.setState({ cascadingStyle: cascadingStyles.right });
  }

  componentWillUnmount() {
    if (this.state.active) {
      window.removeEventListener('click', this._handleOutsideClick);
    }

    if (this._touchTimeout) {
      clearTimeout(this._touchTimeout);
    }
  }

  /**
   * A utility function to focus the `AccessibleFakeInkedButton` in the `ListItem` and also
   * inject an ink to indicate focus.
   */
  focus() {
    if (this._tile) {
      this._tile.focus();
    }
  }

  /**
   * A utility function to blur the `AccessibleFakeInkedButton` in the `ListItem`.
   */
  blur() {
    if (this._tile) {
      this._tile.blur();
    }
  }

  _setTile(tile) {
    if (tile) {
      this._tile = tile;
    }
  }

  _setContainer(container) {
    if (container) {
      this._container = findDOMNode(container);
    }
  }

  _handleOutsideClick(e) {
    if (this._container && !this._container.contains(e.target)) {
      window.removeEventListener('click', this._handleOutsideClick);
      this.setState({ active: false });
    }
  }

  _handleClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }

    if (typeof this.state.isOpen !== 'undefined') {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }

  _handleMouseOver(e) {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(e);
    }

    if (!this.props.disabled) {
      this.setState({ active: true });
    }
  }

  _handleMouseLeave(e) {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }

    if (!this.props.disabled) {
      this.setState({ active: false });
    }
  }

  _handleTouchStart(e) {
    if (this.props.onTouchStart) {
      this.props.onTouchStart(e);
    }

    this._touched = true;

    this.setState({ active: true, touchedAt: Date.now() });
  }

  _handleTouchEnd(e) {
    if (this.props.onTouchEnd) {
      this.props.onTouchEnd(e);
    }

    const time = Date.now() - this.state.touchedAt;
    this._touchTimeout = setTimeout(() => {
      this._touchTimeout = null;

      this.setState({ active: false });
    }, time > 450 ? 0 : 450 - time);
  }

  _handleKeyUp(e) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }

    if ((e.which || e.keyCode) === TAB) {
      window.addEventListener('click', this._handleOutsideClick);
      this.setState({ active: true });
    }
  }

  _handleKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }

    if ((e.which || e.keyCode) === TAB) {
      window.removeEventListener('click', this._handleOutsideClick);
      this.setState({ active: false });
    }
  }

  _reposition(listComponent) {
    if (!listComponent || !this.context.cascading) {
      return;
    }

    const list = findDOMNode(listComponent);
    const vp = viewport(list);
    if (vp !== true) {
      let cascadingStyle;
      const { top, right, bottom, left } = vp;
      if (!left) {
        cascadingStyle = cascadingStyles[`right${top ? 'Reversed' : ''}`];
      } else if (!right) {
        cascadingStyle = cascadingStyles[`left${top ? 'Reversed' : ''}`];
      } else if (!top) {
        cascadingStyle = cascadingStyles[`${right ? 'right' : 'left'}Reversed`];
      } else if (!bottom) {
        cascadingStyle = cascadingStyles[right ? 'right' : 'left'];
      }

      if (cascadingStyle) {
        this.setState({ cascadingStyle });
      }
    }
  }

  render() {
    const {
      style,
      className,
      tileStyle,
      tileClassName,
      disabled,
      leftIcon,
      leftAvatar,
      inset,
      rightIcon,
      rightAvatar,
      primaryText,
      secondaryText,
      threeLines,
      children,
      nestedItems,
      active,
      activeClassName,
      animateNestedItems,
      expanderIconChildren,
      expanderIconClassName,
      itemComponent: ItemComponent,
      'aria-setsize': ariaSize,
      'aria-posinset': ariaPos,
      /* eslint-disable no-unused-vars */
      isOpen: propIsOpen,
      defaultOpen,
      initiallyOpen,
      /* eslint-enable no-unused-vars */
      ...props
    } = this.props;

    const isOpen = getField(this.props, this.state, 'isOpen');
    const { cascadingStyle } = this.state;
    const { cascading } = this.context;
    const leftNode = (
      <TileAddon
        key="left-addon"
        active={active}
        activeClassName={activeClassName}
        icon={leftIcon}
        avatar={leftAvatar}
      />
    );

    let rightNode = (
      <TileAddon
        key="right-addon"
        active={active}
        activeClassName={activeClassName}
        icon={rightIcon}
        avatar={rightAvatar}
      />
    );

    let nestedList;
    if (nestedItems) {
      nestedList = (
        <Collapse collapsed={!isOpen} animate={animateNestedItems}>
          <List ref={this._reposition} style={cascading && cascadingStyle}>{nestedItems}</List>
        </Collapse>
      );

      if (!rightIcon || !rightAvatar) {
        const suffix = this.context.cascading ? 'sideways' : undefined;
        rightNode = (
          <TileAddon
            key="expander-addon"
            icon={(
              <Collapser flipped={isOpen} iconClassName={expanderIconClassName} suffix={suffix}>
                {expanderIconChildren}
              </Collapser>
            )}
            avatar={null}
          />
        );
      }
    }
    const icond = !!leftIcon || !!rightIcon;
    const avatard = !!leftAvatar || !!rightAvatar;

    return (
      <ItemComponent
        style={style}
        className={cn('md-list-item', {
          'md-list-item--cascading': cascading && nestedItems,
        }, className)}
        aria-setsize={ariaSize}
        aria-posinset={ariaPos}
        ref={this._setContainer}
      >
        <AccessibleFakeInkedButton
          {...props}
          __SUPER_SECRET_REF__={this._setTile}
          key="tile"
          onClick={this._handleClick}
          onMouseOver={this._handleMouseOver}
          onMouseLeave={this._handleMouseLeave}
          onTouchStart={this._handleTouchStart}
          onTouchEnd={this._handleTouchEnd}
          onKeyDown={this._handleKeyDown}
          onKeyUp={this._handleKeyUp}
          disabled={disabled}
          style={tileStyle}
          className={cn('md-list-tile', {
            'md-text': !disabled,
            'md-text--disabled': disabled,
            'md-list-tile--active': this.state.active && !this._touched,
            'md-list-tile--icon': !secondaryText && icond && !avatard,
            'md-list-tile--avatar': !secondaryText && avatard,
            'md-list-tile--two-lines': secondaryText && !threeLines,
            'md-list-tile--three-lines': secondaryText && threeLines,
            'md-list-item--inset': inset && !leftIcon && !leftAvatar,
          }, tileClassName)}
          aria-expanded={nestedList ? isOpen : null}
        >
          {leftNode}
          <ListItemText
            active={active}
            activeClassName={activeClassName}
            disabled={disabled}
            primaryText={primaryText}
            secondaryText={secondaryText}
            threeLines={threeLines}
            className={cn({
              'md-tile-content--left-icon': leftIcon,
              'md-tile-content--left-avatar': leftAvatar,
              'md-tile-content--right-padding': rightIcon || rightAvatar,
            })}
          />
          {rightNode}
          {children}
        </AccessibleFakeInkedButton>
        {nestedList}
      </ItemComponent>
    );
  }
}
