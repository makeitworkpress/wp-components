const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, Button } = wp.components;
const { useState } = wp.element;
interface Tab {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

interface Attributes {
  tabs: Tab[];
  position: string;
  hoverItem: string;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { tabs, position, hoverItem } = attributes;
  const [activeTab, setActiveTab] = useState(0);

  const blockProps = useBlockProps({
    className: `atom atom-tabs atom-tabs-${position}`,
  });

  const addTab = () => {
    const newTabs = [
      ...tabs,
      {
        id: `tab-${Date.now()}`,
        title: __("New Tab", "wp-components"),
        content: "",
      },
    ];
    setAttributes({ tabs: newTabs });
    setActiveTab(newTabs.length - 1);
  };

  const removeTab = (index: number) => {
    const newTabs = tabs.filter((_, i) => i !== index);
    setAttributes({ tabs: newTabs });
    if (activeTab >= newTabs.length) {
      setActiveTab(Math.max(0, newTabs.length - 1));
    }
  };

  const updateTab = (index: number, field: keyof Tab, value: string) => {
    const newTabs = tabs.map((tab, i) =>
      i === index ? { ...tab, [field]: value } : tab
    );
    setAttributes({ tabs: newTabs });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Tabs Settings", "wp-components")} initialOpen={true}>
          <SelectControl
            label={__("Tab Position", "wp-components")}
            value={position}
            options={[
              { label: __("Top", "wp-components"), value: "top" },
              { label: __("Bottom", "wp-components"), value: "bottom" },
              { label: __("Left", "wp-components"), value: "left" },
              { label: __("Right", "wp-components"), value: "right" },
            ]}
            onChange={(value: string) => setAttributes({ position: value })}
          />
          <TextControl
            label={__("Hover Effect", "wp-components")}
            value={hoverItem}
            onChange={(value: string) => setAttributes({ hoverItem: value })}
            help={__("Hover.css class name (e.g., underline-from-left)", "wp-components")}
          />
        </PanelBody>

        <PanelBody title={__("Tab Icons", "wp-components")} initialOpen={false}>
          {tabs.map((tab, index) => (
            <TextControl
              key={tab.id}
              label={`${tab.title} ${__("Icon", "wp-components")}`}
              value={tab.icon || ""}
              onChange={(value: string) => updateTab(index, "icon", value)}
              placeholder="fas fa-icon"
            />
          ))}
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <ul className="atom-tabs-navigation">
          {tabs.map((tab, index) => (
            <li key={tab.id}>
              <button
                className={`atom-tab ${index === activeTab ? "active" : "inactive"}`}
                onClick={() => setActiveTab(index)}
                type="button"
              >
                {tab.icon && <i className={`${tab.icon} hvr-icon`} />}
                <RichText
                  tagName="span"
                  value={tab.title}
                  onChange={(value: string) => updateTab(index, "title", value)}
                  placeholder={__("Tab Title", "wp-components")}
                  allowedFormats={[]}
                />
                <Button
                  icon="no-alt"
                  isSmall
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); removeTab(index); }}
                  label={__("Remove Tab", "wp-components")}
                />
              </button>
            </li>
          ))}
          <li>
            <Button variant="secondary" onClick={addTab} icon="plus">
              {__("Add Tab", "wp-components")}
            </Button>
          </li>
        </ul>

        <div className="atom-tabs-content">
          {tabs.map((tab, index) => (
            <section
              key={tab.id}
              className={`atom-tab ${index === activeTab ? "active" : ""}`}
              style={{ display: index === activeTab ? "block" : "none" }}
            >
              <RichText
                tagName="div"
                value={tab.content}
                onChange={(value: string) => updateTab(index, "content", value)}
                placeholder={__("Tab content...", "wp-components")}
              />
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

export default Edit;
