const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, ToggleControl, RangeControl, Button } = wp.components;
const { useSelect } = wp.data;
interface Attributes { container: boolean; fullHeight: boolean; parallax: boolean; backgroundImage: number; backgroundColor: string; overlayColor: string; overlayOpacity: number; videoBackground: string; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { container, fullHeight, parallax, backgroundImage, backgroundColor, overlayColor, overlayOpacity, videoBackground } = attributes;

  const imageData = useSelect((select: (arg: string) => any) => backgroundImage ? (select("core") as any).getMedia(backgroundImage) : null, [backgroundImage]);

  const style: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
    backgroundImage: imageData ? `url(${imageData.source_url})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: fullHeight ? "100vh" : undefined,
    position: "relative" as const,
  };

  const blockProps = useBlockProps({ className: `molecule molecule-section ${fullHeight ? "molecule-section-fullheight" : ""} ${parallax ? "molecule-section-parallax" : ""}`.trim(), style });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Section Settings", "wp-components")} initialOpen={true}>
          <ToggleControl label={__("Use Container", "wp-components")} checked={container} onChange={(value: boolean) => setAttributes({ container: value })} />
          <ToggleControl label={__("Full Height", "wp-components")} checked={fullHeight} onChange={(value: boolean) => setAttributes({ fullHeight: value })} />
          <ToggleControl label={__("Parallax Effect", "wp-components")} checked={parallax} onChange={(value: boolean) => setAttributes({ parallax: value })} />
        </PanelBody>
        <PanelBody title={__("Background", "wp-components")} initialOpen={false}>
          <MediaUploadCheck>
            <MediaUpload onSelect={(media: any) => setAttributes({ backgroundImage: media.id })} allowedTypes={["image"]} value={backgroundImage}
              render={({ open }: { open: () => void }) => (
                <div style={{ marginBottom: "16px" }}>
                  {backgroundImage && imageData ? (
                    <>
                      <img src={imageData.source_url} alt="" style={{ maxWidth: "100%", marginBottom: "8px" }} />
                      <Button isDestructive onClick={() => setAttributes({ backgroundImage: 0 })}>{__("Remove", "wp-components")}</Button>
                    </>
                  ) : (
                    <Button variant="secondary" onClick={open}>{__("Select Background Image", "wp-components")}</Button>
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>
          <TextControl label={__("Background Color", "wp-components")} value={backgroundColor} onChange={(value: string) => setAttributes({ backgroundColor: value })} placeholder="#000000" />
          <TextControl label={__("Video Background URL", "wp-components")} value={videoBackground} onChange={(value: string) => setAttributes({ videoBackground: value })} />
        </PanelBody>
        <PanelBody title={__("Overlay", "wp-components")} initialOpen={false}>
          <TextControl label={__("Overlay Color", "wp-components")} value={overlayColor} onChange={(value: string) => setAttributes({ overlayColor: value })} placeholder="rgba(0,0,0,0.5)" />
          <RangeControl label={__("Overlay Opacity", "wp-components")} value={overlayOpacity} onChange={(value: number) => setAttributes({ overlayOpacity: value || 0.5 })} min={0} max={1} step={0.1} />
        </PanelBody>
      </InspectorControls>
      <section {...blockProps}>
        {overlayColor && <div className="molecule-section-overlay" style={{ position: "absolute", inset: 0, backgroundColor: overlayColor, opacity: overlayOpacity }} />}
        <div className={container ? "components-container" : ""} style={{ position: "relative", zIndex: 1 }}>
          <InnerBlocks templateLock={false} />
        </div>
      </section>
    </>
  );
}

export default Edit;
