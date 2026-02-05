/**
 * BlockWrapper - Wraps block content with WordPress block props for styling support
 * Provides support for WordPress's general block styling properties:
 * - Typography (font size, font family, line height)
 * - Spacing (margin, padding)
 * - Color (text, background)
 * - Border
 * - Dimensions
 */
const wp = (window as any).wp;
const { useBlockProps } = wp.blockEditor;

interface BlockWrapperProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
}

/**
 * Wrapper component that applies WordPress block props to a container div.
 * This enables support for WordPress's built-in block styling controls
 * (typography, spacing, colors, etc.) via the block supports API.
 *
 * Usage in edit.tsx:
 * ```tsx
 * import BlockWrapper from "@scripts/editor/BlockWrapper";
 *
 * export default function Edit({ attributes, setAttributes }) {
 *   return (
 *     <BlockWrapper>
 *       <InspectorControls>...</InspectorControls>
 *       <ServerSideRender block="wpc/my-block" attributes={attributes} />
 *     </BlockWrapper>
 *   );
 * }
 * ```
 */
export default function BlockWrapper({
  children,
  className = "",
}: BlockWrapperProps) {
  const blockProps = useBlockProps({
    className: className
      ? `wpc-block-wrapper ${className}`
      : "wpc-block-wrapper",
  });

  return <div {...blockProps}>{children}</div>;
}
