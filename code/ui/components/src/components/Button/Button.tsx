import type { ButtonHTMLAttributes, SyntheticEvent } from 'react';
import React, { forwardRef, useEffect, useState } from 'react';
import { styled } from '@storybook/theming';
import { darken, lighten, rgba, transparentize } from 'polished';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: 'small' | 'medium';
  padding?: 'small' | 'medium';
  variant?: 'outline' | 'solid' | 'ghost';
  onClick?: (event: SyntheticEvent) => void;
  disabled?: boolean;
  active?: boolean;
  onClickAnimation?: 'none' | 'rotate360' | 'glow' | 'jiggle';

  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  isLink?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  primary?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  secondary?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  tertiary?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  gray?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  inForm?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  small?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  outline?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  containsIcon?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, onClickAnimation = 'none', onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    let { variant, size } = props;

    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (event: SyntheticEvent) => {
      if (onClick) onClick(event);
      if (onClickAnimation === 'none') return;
      setIsAnimating(true);
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        if (isAnimating) setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }, [isAnimating]);

    // Match the old API with the new API.
    // TODO: Remove this after 9.0.
    if (props.primary) {
      variant = 'solid';
      size = 'medium';
    }

    // Match the old API with the new API.
    // TODO: Remove this after 9.0.
    if (props.secondary || props.tertiary || props.gray || props.outline || props.inForm) {
      variant = 'outline';
      size = 'medium';
    }

    return (
      <StyledButton
        as={Comp}
        ref={ref}
        variant={variant}
        size={size}
        onClick={handleClick}
        isAnimating={isAnimating}
        animation={onClickAnimation}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

const StyledButton = styled.button<
  ButtonProps & {
    isAnimating: boolean;
    animation: ButtonProps['onClickAnimation'];
  }
>(
  ({
    theme,
    variant = 'outline',
    size = 'small',
    disabled = false,
    active = false,
    isAnimating,
    animation,
    padding = 'medium',
  }) => ({
    border: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    gap: '6px',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: `${(() => {
      if (padding === 'small' && size === 'small') return '0 7px';
      if (padding === 'small' && size === 'medium') return '0 9px';
      if (size === 'small') return '0 10px';
      if (size === 'medium') return '0 12px';
      return 0;
    })()}`,
    height: size === 'small' ? '28px' : '32px',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transitionProperty: 'background, box-shadow',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-out',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    opacity: disabled ? 0.5 : 1,
    margin: 0,
    fontSize: `${theme.typography.size.s1}px`,
    fontWeight: theme.typography.weight.bold,
    lineHeight: '1',
    background: `${(() => {
      if (variant === 'solid') return theme.color.secondary;
      if (variant === 'outline') return theme.button.background;
      if (variant === 'ghost' && active) return theme.background.hoverable;
      return 'transparent';
    })()}`,
    color: `${(() => {
      if (variant === 'solid') return theme.color.lightest;
      if (variant === 'outline') return theme.input.color;
      if (variant === 'ghost' && active) return theme.color.secondary;
      if (variant === 'ghost') return theme.color.mediumdark;
      return theme.input.color;
    })()}`,
    boxShadow: variant === 'outline' ? `${theme.button.border} 0 0 0 1px inset` : 'none',
    borderRadius: theme.input.borderRadius,

    '&:hover': {
      color: variant === 'ghost' ? theme.color.secondary : null,
      background: `${(() => {
        let bgColor = theme.color.secondary;
        if (variant === 'solid') bgColor = theme.color.secondary;
        if (variant === 'outline') bgColor = theme.button.background;

        if (variant === 'ghost') return transparentize(0.86, theme.color.secondary);
        return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
      })()}`,
    },

    '&:active': {
      color: variant === 'ghost' ? theme.color.secondary : null,
      background: `${(() => {
        let bgColor = theme.color.secondary;
        if (variant === 'solid') bgColor = theme.color.secondary;
        if (variant === 'outline') bgColor = theme.button.background;

        if (variant === 'ghost') return theme.background.hoverable;
        return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
      })()}`,
    },

    '&:focus': {
      boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
      outline: 'none',
    },

    '> *': {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      minWidth: 14,
      height: 14,
      animation:
        isAnimating && animation !== 'none' && `${theme.animation[animation]} 1000ms ease-out`,
    },
  })
);
