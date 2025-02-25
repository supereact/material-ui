'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { alpha } from '@mui/system/colorManipulator';
import elementTypeAcceptingRef from '@mui/utils/elementTypeAcceptingRef';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '../utils/capitalize';
import { styled, createUseThemeProps, useTheme } from '../zero-styled';
import useIsFocusVisible from '../utils/useIsFocusVisible';
import useForkRef from '../utils/useForkRef';
import Typography from '../Typography';
import linkClasses, { getLinkUtilityClass } from './linkClasses';
import getTextDecoration, { colorTransformations } from './getTextDecoration';

const useThemeProps = createUseThemeProps('MuiLink');

const useUtilityClasses = (ownerState) => {
  const { classes, component, focusVisible, underline } = ownerState;

  const slots = {
    root: [
      'root',
      `underline${capitalize(underline)}`,
      component === 'button' && 'button',
      focusVisible && 'focusVisible',
    ],
  };

  return composeClasses(slots, getLinkUtilityClass, classes);
};

const LinkRoot = styled(Typography, {
  name: 'MuiLink',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;

    return [
      styles.root,
      styles[`underline${capitalize(ownerState.underline)}`],
      ownerState.component === 'button' && styles.button,
    ];
  },
})(({ theme }) => {
  return {
    variants: [
      {
        props: {
          underline: 'none',
        },
        style: {
          textDecoration: 'none',
        },
      },
      {
        props: {
          underline: 'hover',
        },
        style: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
      {
        props: {
          underline: 'always',
        },
        style: {
          textDecoration: 'underline',
          '&:hover': {
            textDecorationColor: 'inherit',
          },
        },
      },
      {
        props: ({ underline, ownerState }) =>
          underline === 'always' && ownerState.color !== 'inherit',
        style: {
          textDecorationColor: 'var(--Link-underlineColor)',
        },
      },
      ...Object.entries(theme.palette)
        .filter(([, value]) => value && value.main)
        .map(([color]) => ({
          props: { underline: 'always', color },
          style: {
            '--Link-underlineColor': theme.vars
              ? `rgba(${theme.vars.palette[color].mainChannel} / 0.4)`
              : alpha(theme.palette[color].main, 0.4),
          },
        })),
      {
        props: {
          component: 'button',
        },
        style: {
          position: 'relative',
          WebkitTapHighlightColor: 'transparent',
          backgroundColor: 'transparent', // Reset default value
          // We disable the focus ring for mouse, touch and keyboard users.
          outline: 0,
          border: 0,
          margin: 0, // Remove the margin in Safari
          borderRadius: 0,
          padding: 0, // Remove the padding in Firefox
          cursor: 'pointer',
          userSelect: 'none',
          verticalAlign: 'middle',
          MozAppearance: 'none', // Reset
          WebkitAppearance: 'none', // Reset
          '&::-moz-focus-inner': {
            borderStyle: 'none', // Remove Firefox dotted outline.
          },
          [`&.${linkClasses.focusVisible}`]: {
            outline: 'auto',
          },
        },
      },
    ],
  };
});

const Link = React.forwardRef(function Link(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiLink',
  });
  const theme = useTheme();

  const {
    className,
    color = 'primary',
    component = 'a',
    onBlur,
    onFocus,
    TypographyClasses,
    underline = 'always',
    variant = 'inherit',
    sx,
    ...other
  } = props;

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef,
  } = useIsFocusVisible();
  const [focusVisible, setFocusVisible] = React.useState(false);
  const handlerRef = useForkRef(ref, focusVisibleRef);
  const handleBlur = (event) => {
    handleBlurVisible(event);
    if (isFocusVisibleRef.current === false) {
      setFocusVisible(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  };
  const handleFocus = (event) => {
    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setFocusVisible(true);
    }
    if (onFocus) {
      onFocus(event);
    }
  };

  const ownerState = {
    ...props,
    color,
    component,
    focusVisible,
    underline,
    variant,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <LinkRoot
      color={color}
      className={clsx(classes.root, className)}
      classes={TypographyClasses}
      component={component}
      onBlur={handleBlur}
      onFocus={handleFocus}
      ref={handlerRef}
      ownerState={ownerState}
      variant={variant}
      {...other}
      sx={[
        ...(colorTransformations[color] === undefined ? [{ color }] : []),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      style={{
        ...other.style,
        ...(underline === 'always' &&
          color !== 'inherit' && {
            '--Link-underlineColor': getTextDecoration({ theme, ownerState }),
          }),
      }}
    />
  );
});

Link.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the link.
   * @default 'primary'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.any,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: elementTypeAcceptingRef,
  /**
   * @ignore
   */
  onBlur: PropTypes.func,
  /**
   * @ignore
   */
  onFocus: PropTypes.func,
  /**
   * @ignore
   */
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * `classes` prop applied to the [`Typography`](/material-ui/api/typography/) element.
   */
  TypographyClasses: PropTypes.object,
  /**
   * Controls when the link should have an underline.
   * @default 'always'
   */
  underline: PropTypes.oneOf(['always', 'hover', 'none']),
  /**
   * Applies the theme typography styles.
   * @default 'inherit'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf([
      'body1',
      'body2',
      'button',
      'caption',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'inherit',
      'overline',
      'subtitle1',
      'subtitle2',
    ]),
    PropTypes.string,
  ]),
};

export default Link;
