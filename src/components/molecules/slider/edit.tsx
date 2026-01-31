/**
 * WPC Slider Block - Editor Component
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, RangeControl, Button, Placeholder } from "@wordpress/components";

interface Slide { id: number; url: string; alt: string; caption?: string; }
interface Attributes { slides: Slide[]; autoplay: boolean; autoplaySpeed: number; arrows: boolean; dots: boolean; loop: boolean; speed: number; slidesToShow: number; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }

function Edit({ attributes, setAttributes }: Props) {
  const { slides, autoplay, autoplaySpeed, arrows, dots, loop, speed, slidesToShow } = attributes;
  const blockProps = useBlockProps({ className: "molecule molecule-slider" });

  const onSelectImages = (media: any[]) => {
    const newSlides = media.map((m) => ({ id: m.id, url: m.url, alt: m.alt || "", caption: m.caption || "" }));
    setAttributes({ slides: newSlides });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Slider Settings", "wp-components")} initialOpen={true}>
          <ToggleControl label={__("Autoplay", "wp-components")} checked={autoplay} onChange={(value) => setAttributes({ autoplay: value })} />
          {autoplay && <RangeControl label={__("Autoplay Speed (ms)", "wp-components")} value={autoplaySpeed} onChange={(value) => setAttributes({ autoplaySpeed: value || 5000 })} min={1000} max={10000} step={500} />}
          <ToggleControl label={__("Show Arrows", "wp-components")} checked={arrows} onChange={(value) => setAttributes({ arrows: value })} />
          <ToggleControl label={__("Show Dots", "wp-components")} checked={dots} onChange={(value) => setAttributes({ dots: value })} />
          <ToggleControl label={__("Loop", "wp-components")} checked={loop} onChange={(value) => setAttributes({ loop: value })} />
          <RangeControl label={__("Animation Speed (ms)", "wp-components")} value={speed} onChange={(value) => setAttributes({ speed: value || 500 })} min={100} max={2000} step={100} />
          <RangeControl label={__("Slides to Show", "wp-components")} value={slidesToShow} onChange={(value) => setAttributes({ slidesToShow: value || 1 })} min={1} max={6} />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <MediaUploadCheck>
          <MediaUpload onSelect={onSelectImages} allowedTypes={["image"]} multiple gallery value={slides.map((s) => s.id)}
            render={({ open }) => (
              slides.length > 0 ? (
                <div className="molecule-slider-preview">
                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "8px" }}>
                    {slides.map((slide, i) => (
                      <img key={i} src={slide.url} alt={slide.alt} style={{ height: "120px", objectFit: "cover" }} />
                    ))}
                  </div>
                  <Button variant="secondary" onClick={open} style={{ marginTop: "8px" }}>{__("Edit Gallery", "wp-components")}</Button>
                </div>
              ) : (
                <Placeholder icon="slides" label={__("WPC Slider", "wp-components")} instructions={__("Select images for the slider", "wp-components")}>
                  <Button variant="primary" onClick={open}>{__("Select Images", "wp-components")}</Button>
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
