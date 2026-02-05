/**
 * Image Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls, MediaUpload } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, Button } =
  wp.components;
const ServerSideRender = wp.serverSideRender;

interface ImageAttributes extends Partial<BaseAttributes> {
  enlarge: boolean;
  image: string;
  link: string;
  schema: boolean;
  size: string;
}

interface EditProps {
  attributes: ImageAttributes;
  setAttributes: (attrs: Partial<ImageAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { enlarge, image, link, schema, size } = attributes;

  return (
    <BlockWrapper className="atom-image">
      <InspectorControls>
        <PanelBody
          title={__("Image Settings", "wp-components")}
          initialOpen={true}
        >
          <MediaUpload
            onSelect={(media: any) =>
              setAttributes({ image: media.id.toString() })
            }
            allowedTypes={["image"]}
            render={({ open }: any) => (
              <Button onClick={open} variant="secondary">
                {image
                  ? __("Change Image", "wp-components")
                  : __("Select Image", "wp-components")}
              </Button>
            )}
          />
          <SelectControl
            label={__("Size", "wp-components")}
            value={size}
            options={[
              { label: __("Thumbnail", "wp-components"), value: "thumbnail" },
              { label: __("Medium", "wp-components"), value: "medium" },
              { label: __("Large", "wp-components"), value: "large" },
              { label: __("Full", "wp-components"), value: "full" },
            ]}
            onChange={(value: string) => setAttributes({ size: value })}
          />
          <TextControl
            label={__("Link", "wp-components")}
            value={link}
            onChange={(value: string) => setAttributes({ link: value })}
            help={__("Use 'post' for post permalink", "wp-components")}
          />
          <ToggleControl
            label={__("Enlarge on Click", "wp-components")}
            checked={enlarge}
            onChange={(value: boolean) => setAttributes({ enlarge: value })}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/image" attributes={attributes} />
    </BlockWrapper>
  );
}
