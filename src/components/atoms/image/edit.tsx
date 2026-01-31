const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes {
  image: number;
  size: string;
  link: string;
  enlarge: boolean;
  schema: boolean;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { image, size, link, enlarge, schema } = attributes;

  const blockProps = useBlockProps({
    className: `atom atom-image ${enlarge ? "atom-image-enlarge" : ""}`.trim(),
  });

  const imageData = useSelect(
    (select) => {
      if (!image) return null;
      return (select("core") as any).getMedia(image);
    },
    [image]
  );

  const imageSizes = useSelect((select) => {
    const settings = (select("core/block-editor") as any).getSettings();
    return settings.imageSizes || [];
  }, []);

  const sizeOptions = imageSizes.map((size: { slug: string; name: string }) => ({
    label: size.name,
    value: size.slug,
  }));

  const getImageUrl = () => {
    if (!imageData) return null;
    if (imageData.media_details?.sizes?.[size]?.source_url) {
      return imageData.media_details.sizes[size].source_url;
    }
    return imageData.source_url;
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Image Settings", "wp-components")} initialOpen={true}>
          <SelectControl
            label={__("Image Size", "wp-components")}
            value={size}
            options={sizeOptions.length > 0 ? sizeOptions : [
              { label: "Large", value: "large" },
              { label: "Medium", value: "medium" },
              { label: "Thumbnail", value: "thumbnail" },
              { label: "Full", value: "full" },
            ]}
            onChange={(value) => setAttributes({ size: value })}
          />
          <TextControl
            label={__("Link URL", "wp-components")}
            value={link}
            onChange={(value) => setAttributes({ link: value })}
            placeholder={__("https://example.com", "wp-components")}
            help={__("Leave empty for no link, or use 'post' for post permalink", "wp-components")}
          />
          <ToggleControl
            label={__("Enable Enlarge Effect", "wp-components")}
            checked={enlarge}
            onChange={(value) => setAttributes({ enlarge: value })}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value) => setAttributes({ schema: value })}
          />
        </PanelBody>
      </InspectorControls>

      <figure {...blockProps}>
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) => setAttributes({ image: media.id })}
            allowedTypes={["image"]}
            value={image}
            render={({ open }) => (
              <>
                {image && getImageUrl() ? (
                  <div onClick={open} style={{ cursor: "pointer" }}>
                    <img src={getImageUrl()!} alt="" style={{ maxWidth: "100%", height: "auto" }} />
                    <Button variant="secondary" onClick={open} style={{ marginTop: "8px" }}>
                      {__("Replace Image", "wp-components")}
                    </Button>
                  </div>
                ) : (
                  <Placeholder
                    icon="format-image"
                    label={__("WPC Image", "wp-components")}
                    instructions={__("Select an image from the media library", "wp-components")}
                  >
                    <Button variant="primary" onClick={open}>
                      {__("Select Image", "wp-components")}
                    </Button>
                  </Placeholder>
                )}
              </>
            )}
          />
        </MediaUploadCheck>
      </figure>
    </>
  );
}

export default Edit;
