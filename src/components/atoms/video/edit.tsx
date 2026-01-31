const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes { src: string; poster: number; autoplay: boolean; loop: boolean; muted: boolean; controls: boolean; schema: boolean; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { src, autoplay, loop, muted, controls, schema } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-video" });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Video Settings", "wp-components")} initialOpen={true}>
          <TextControl label={__("Video URL", "wp-components")} value={src} onChange={(value) => setAttributes({ src: value })} placeholder="https://youtube.com/watch?v=..." />
          <ToggleControl label={__("Autoplay", "wp-components")} checked={autoplay} onChange={(value) => setAttributes({ autoplay: value })} />
          <ToggleControl label={__("Loop", "wp-components")} checked={loop} onChange={(value) => setAttributes({ loop: value })} />
          <ToggleControl label={__("Muted", "wp-components")} checked={muted} onChange={(value) => setAttributes({ muted: value })} />
          <ToggleControl label={__("Show Controls", "wp-components")} checked={controls} onChange={(value) => setAttributes({ controls: value })} />
          <ToggleControl label={__("Schema Markup", "wp-components")} checked={schema} onChange={(value) => setAttributes({ schema: value })} />
        </PanelBody>
      </InspectorControls>
      <figure {...blockProps}>
        {src ? (
          <div className="atom-video-preview" style={{ background: "#000", padding: "40px", textAlign: "center", color: "#fff" }}>
            <i className="fas fa-play-circle" style={{ fontSize: "48px" }} /><br /><small>{src}</small>
          </div>
        ) : (
          <Placeholder icon="video-alt3" label={__("WPC Video", "wp-components")} instructions={__("Enter video URL in settings", "wp-components")} />
        )}
      </figure>
    </>
  );
}

export default Edit;
