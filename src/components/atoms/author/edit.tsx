/**
 * WPC Author Block - Editor Component
 */

import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  SelectControl,
  ToggleControl,
} from "@wordpress/components";


interface Attributes {
  showAvatar: boolean;
  showDescription: boolean;
  showName: boolean;
  imageFloat: string;
  imageRounded: boolean;
  prepend: string;
  jobTitle: string;
  schema: boolean;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { showAvatar, showDescription, showName, imageFloat, imageRounded, prepend, jobTitle, schema } = attributes;

  const blockProps = useBlockProps({
    className: "atom atom-author",
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Display Settings", "wp-components")} initialOpen={true}>
          <ToggleControl
            label={__("Show Avatar", "wp-components")}
            checked={showAvatar}
            onChange={(value) => setAttributes({ showAvatar: value })}
          />
          <ToggleControl
            label={__("Show Name", "wp-components")}
            checked={showName}
            onChange={(value) => setAttributes({ showName: value })}
          />
          <ToggleControl
            label={__("Show Description", "wp-components")}
            checked={showDescription}
            onChange={(value) => setAttributes({ showDescription: value })}
          />
        </PanelBody>

        <PanelBody title={__("Avatar Settings", "wp-components")} initialOpen={false}>
          <SelectControl
            label={__("Image Float", "wp-components")}
            value={imageFloat}
            options={[
              { label: __("None", "wp-components"), value: "none" },
              { label: __("Left", "wp-components"), value: "left" },
              { label: __("Right", "wp-components"), value: "right" },
            ]}
            onChange={(value) => setAttributes({ imageFloat: value })}
          />
          <ToggleControl
            label={__("Rounded Avatar", "wp-components")}
            checked={imageRounded}
            onChange={(value) => setAttributes({ imageRounded: value })}
          />
        </PanelBody>

        <PanelBody title={__("Content Settings", "wp-components")} initialOpen={false}>
          <TextControl
            label={__("Name Prepend", "wp-components")}
            value={prepend}
            onChange={(value) => setAttributes({ prepend: value })}
            placeholder={__("Written by ", "wp-components")}
          />
          <TextControl
            label={__("Job Title", "wp-components")}
            value={jobTitle}
            onChange={(value) => setAttributes({ jobTitle: value })}
            placeholder={__("Developer", "wp-components")}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value) => setAttributes({ schema: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="atom-author-preview">
          {showAvatar && (
            <figure className={`atom-author-avatar components-${imageFloat}-float ${imageRounded ? 'components-rounded' : ''}`}>
              <div style={{ width: 100, height: 100, background: '#ddd', borderRadius: imageRounded ? '50%' : 0 }} />
            </figure>
          )}
          <div className={`atom-author-description components-${imageFloat}-float`}>
            {showName && <h4>{prepend}{__("Author Name", "wp-components")}</h4>}
            {jobTitle && <p>{jobTitle}</p>}
            {showDescription && <p>{__("Author bio will appear here...", "wp-components")}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;
