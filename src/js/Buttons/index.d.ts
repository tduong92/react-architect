import * as React from 'react';
import { Props } from '../index';
import { InjectedTooltipProps, TooltippedComponent } from '../Tooltips';
import { InjectedInkProps } from '../Inks';

export type ButtonTypes = 'button' | 'submit' | 'reset';
type FixedPositions = 'tr' | 'tl' | 'br' | 'bl';

export interface ButtonProps extends InjectedTooltipProps, InjectedInkProps {
  label?: string;
  iconBefore?: boolean;
  children?: React.ReactNode;
  iconClassName?: string;
  type?: ButtonTypes;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  href?: string;
  component?: Function | string;
  fixed?: boolean;
  fixedPosition?: FixedPositions;
  mini?: boolean;
  flat?: boolean;
  raised?: boolean;
  icon?: boolean;
  floating?: boolean;
  forceSize?: boolean | number;
}

export default class Button extends React.Component<ButtonProps, {}> {
  createInk(pageX?: number, pageY?: number): void;
  focus(): void;
  getComposedComponent(): TooltippedComponent;
}
