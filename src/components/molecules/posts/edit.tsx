/**
 * Posts Molecule Editor
 * Attributes match Posts.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl, TextControl, SelectControl, RangeControl } =
  wp.components;
const ServerSideRender = wp.serverSideRender;

interface PostsAttributes extends Partial<BaseAttributes> {
  ajax: boolean;
  filter: any[];
  grid_gap: string;
  infinite: boolean;
  none: string;
  pagination: object;
  post_properties: object;
  query: object;
  query_args: object;
  schema: boolean;
  view: string;
  wrapper: string;
}

interface EditProps {
  attributes: PostsAttributes;
  setAttributes: (attrs: Partial<PostsAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { ajax, grid_gap, infinite, none, schema, view } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Posts Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("View", "wp-components")}
            value={view}
            options={[
              { label: __("List", "wp-components"), value: "list" },
              { label: __("Grid", "wp-components"), value: "grid" },
            ]}
            onChange={(value: string) => setAttributes({ view: value })}
          />
          <SelectControl
            label={__("Grid Gap", "wp-components")}
            value={grid_gap}
            options={[
              { label: __("Default", "wp-components"), value: "default" },
              { label: __("None", "wp-components"), value: "none" },
              { label: __("Small", "wp-components"), value: "small" },
              { label: __("Large", "wp-components"), value: "large" },
            ]}
            onChange={(value: string) => setAttributes({ grid_gap: value })}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>

        <PanelBody
          title={__("Pagination", "wp-components")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("AJAX Pagination", "wp-components")}
            checked={ajax}
            onChange={(value: boolean) => setAttributes({ ajax: value })}
            help={__("Load posts without page refresh", "wp-components")}
          />
          <ToggleControl
            label={__("Infinite Scroll", "wp-components")}
            checked={infinite}
            onChange={(value: boolean) => setAttributes({ infinite: value })}
          />
        </PanelBody>

        <PanelBody
          title={__("No Results", "wp-components")}
          initialOpen={false}
        >
          <TextControl
            label={__("No Posts Message", "wp-components")}
            value={none}
            onChange={(value: string) => setAttributes({ none: value })}
            placeholder={__("Bummer! No posts found.", "wp-components")}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/posts" attributes={attributes} />
    </BlockWrapper>
  );
}
