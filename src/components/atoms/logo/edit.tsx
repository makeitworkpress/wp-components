/**
 * Logo Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls, MediaUpload } = wp.blockEditor;
const { PanelBody, SelectControl, TextControl, ToggleControl, Button } =
  wp.components;
const ServerSideRender = wp.serverSideRender;

interface LogoAttributes extends Partial<BaseAttributes> {
  alt: string;
  default: number;
  mode: string;
  schema: boolean;
  size: string;
  title: string;
}

interface EditProps {
  attributes: LogoAttributes;
  setAttributes: (attrs: Partial<LogoAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { alt, mode, schema, size, title } = attributes;
  const defaultLogo = attributes.default;

  return (
    <BlockWrapper className="atom-logo">
      <InspectorControls>
        <PanelBody
          title={__("Logo Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Mode", "wp-components")}
            value={mode}
            options={[
              { label: __("Logo Image", "wp-components"), value: "logo" },
              { label: __("Site Title", "wp-components"), value: "title" },
            ]}
            onChange={(value: string) => setAttributes({ mode: value })}
          />
          {mode === "logo" && (
            <>
              <MediaUpload
                onSelect={(media: any) => setAttributes({ default: media.id })}
                allowedTypes={["image"]}
                render={({ open }: any) => (
                  <Button onClick={open} variant="secondary">
                    {defaultLogo
                      ? __("Change Logo", "wp-components")
                      : __("Select Logo", "wp-components")}
                  </Button>
                )}
              />
              <SelectControl
                label={__("Size", "wp-components")}
                value={size}
                options={[
                  {
                    label: __("Thumbnail", "wp-components"),
                    value: "thumbnail",
                  },
                  { label: __("Medium", "wp-components"), value: "medium" },
                  { label: __("Large", "wp-components"), value: "large" },
                  { label: __("Full", "wp-components"), value: "full" },
                ]}
                onChange={(value: string) => setAttributes({ size: value })}
              />
              <TextControl
                label={__("Alt Text", "wp-components")}
                value={alt}
                onChange={(value: string) => setAttributes({ alt: value })}
              />
            </>
          )}
          {mode === "title" && (
            <TextControl
              label={__("Title", "wp-components")}
              value={title}
              onChange={(value: string) => setAttributes({ title: value })}
              help={__("Leave empty for site name", "wp-components")}
            />
          )}
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

      <ServerSideRender block="wpc/logo" attributes={attributes} />
    </BlockWrapper>
  );
}
