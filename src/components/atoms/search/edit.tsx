const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes {
  ajax: boolean;
  collapse: boolean;
  allText: string;
  noneText: string;
  searchDelay: number;
  minLength: number;
  resultsNumber: number;
  postTypes: string;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { ajax, collapse, allText, noneText, searchDelay, minLength, resultsNumber, postTypes } = attributes;

  const blockProps = useBlockProps({
    className: `atom atom-search ${collapse ? "atom-search-collapse" : ""} ${ajax ? "atom-search-ajax" : ""}`.trim(),
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Search Settings", "wp-components")} initialOpen={true}>
          <ToggleControl
            label={__("Enable AJAX Search", "wp-components")}
            checked={ajax}
            onChange={(value) => setAttributes({ ajax: value })}
            help={__("Show live search results as user types", "wp-components")}
          />
          <ToggleControl
            label={__("Collapsible", "wp-components")}
            checked={collapse}
            onChange={(value) => setAttributes({ collapse: value })}
            help={__("Show only search icon that expands on click", "wp-components")}
          />
          <TextControl
            label={__("Post Types", "wp-components")}
            value={postTypes}
            onChange={(value) => setAttributes({ postTypes: value })}
            placeholder="post,page"
            help={__("Comma-separated list of post types to search", "wp-components")}
          />
        </PanelBody>

        {ajax && (
          <PanelBody title={__("AJAX Settings", "wp-components")} initialOpen={false}>
            <RangeControl
              label={__("Search Delay (ms)", "wp-components")}
              value={searchDelay}
              onChange={(value) => setAttributes({ searchDelay: value || 500 })}
              min={100}
              max={2000}
              step={100}
            />
            <RangeControl
              label={__("Minimum Characters", "wp-components")}
              value={minLength}
              onChange={(value) => setAttributes({ minLength: value || 3 })}
              min={1}
              max={10}
            />
            <RangeControl
              label={__("Results to Show", "wp-components")}
              value={resultsNumber}
              onChange={(value) => setAttributes({ resultsNumber: value || 5 })}
              min={1}
              max={20}
            />
            <TextControl
              label={__("View All Text", "wp-components")}
              value={allText}
              onChange={(value) => setAttributes({ allText: value })}
            />
            <TextControl
              label={__("No Results Text", "wp-components")}
              value={noneText}
              onChange={(value) => setAttributes({ noneText: value })}
            />
          </PanelBody>
        )}
      </InspectorControls>

      <div {...blockProps}>
        <div className="atom-search-form">
          <form role="search">
            <label>
              <span className="screen-reader-text">{__("Search for:", "wp-components")}</span>
              <input type="search" placeholder={__("Search...", "wp-components")} disabled />
            </label>
            <button type="submit" disabled>
              <i className="fas fa-search" />
            </button>
          </form>
        </div>
        {collapse && (
          <a href="#" className="atom-search-expand">
            <i className="fas fa-search" />
          </a>
        )}
      </div>
    </>
  );
}

export default Edit;
