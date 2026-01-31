const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes { image: number; mobileImage: number; link: string; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { image, link } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-logo" });
  const imageData = useSelect((select) => image ? (select("core") as any).getMedia(image) : null, [image]);

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Logo Settings", "wp-components")} initialOpen={true}>
          <TextControl label={__("Link", "wp-components")} value={link} onChange={(value) => setAttributes({ link: value })} help={__("Use 'home' for homepage link", "wp-components")} />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <MediaUploadCheck>
          <MediaUpload onSelect={(media) => setAttributes({ image: media.id })} allowedTypes={["image"]} value={image}
            render={({ open }) => (
              image && imageData ? (
                <div onClick={open} style={{ cursor: "pointer" }}>
                  <img src={imageData.source_url} alt="" style={{ maxWidth: "200px" }} />
                </div>
              ) : (
                <Placeholder icon="format-image" label={__("WPC Logo", "wp-components")}>
                  <Button variant="primary" onClick={open}>{__("Select Logo", "wp-components")}</Button>
                </Placeholder>
              )
            )}
          />
        </MediaUploadCheck>
      </div>
    </>
  );
}

export default Edit;
