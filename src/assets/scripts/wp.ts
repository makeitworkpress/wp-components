const wp = (window as any).wp;

// The Essentials
export const { createElement, Fragment, useState, useEffect, useMemo, useCallback, useRef } = wp.element;
export const { __, _x, _n, _nx } = wp.i18n;

// Block Registration
export const { registerBlockType, createBlock, registerBlockCollection } = wp.blocks;

// Editor & UI components
export const {
    useBlockProps,
    InspectorControls,
    BlockControls,
    RichText,
    AlignmentControl,
    ColorPalette,
    MediaPlaceholder
} = wp.blockEditor;

// Standard UI Components (Modals, Toggles, etc.)
export const {
    PanelBody,
    PanelRow,
    TextControl,
    ToggleControl,
    SelectControl,
    Button,
    ExternalLink,
    Spinner
} = wp.components;

// Data Fetching
export const { useSelect, useDispatch, withSelect, withDispatch } = wp.data;
