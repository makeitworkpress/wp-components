const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, Button, Placeholder } = wp.components;
const { useSelect } = wp.data;
interface Attributes { image: number; mobileImage: number; link: string; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { image, link } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-logo" });
  const imageData = useSelect((select: (args: string) => any) => image ? (select("core") as any).getMedia(image) : null, [image]);

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Logo Settings", "wp-components")} initialOpen={true}>
          <TextControl label={__("Link", "wp-components")} value={link} onChange={(value: string) => setAttributes({ link: value })} help={__("Use 'home' for homepage link", "wp-components")} />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <MediaUploadCheck>
          <MediaUpload onSelect={(media: any) => setAttributes({ image: media.id })} allowedTypes={["image"]} value={image}
            render={({ open }: { open: () => void }) => (
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
