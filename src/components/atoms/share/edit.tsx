/**
 * WPC Share Block - Editor Component
 */

import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
} from "@wordpress/block-editor";
import {
  PanelBody,
  CheckboxControl,
  ToggleControl,
} from "@wordpress/components";


const AVAILABLE_NETWORKS = [
  { value: "facebook", label: "Facebook", icon: "fab fa-facebook-f" },
  { value: "twitter", label: "Twitter/X", icon: "fab fa-twitter" },
  { value: "linkedin", label: "LinkedIn", icon: "fab fa-linkedin-in" },
  { value: "pinterest", label: "Pinterest", icon: "fab fa-pinterest-p" },
  { value: "whatsapp", label: "WhatsApp", icon: "fab fa-whatsapp" },
  { value: "telegram", label: "Telegram", icon: "fab fa-telegram-plane" },
  { value: "email", label: "Email", icon: "fas fa-envelope" },
];

interface Attributes {
  networks: string[];
  showLabels: boolean;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { networks, showLabels } = attributes;

  const blockProps = useBlockProps({
    className: "atom atom-share",
  });

  const toggleNetwork = (network: string) => {
    const newNetworks = networks.includes(network)
      ? networks.filter((n) => n !== network)
      : [...networks, network];
    setAttributes({ networks: newNetworks });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Share Settings", "wp-components")} initialOpen={true}>
          <ToggleControl
            label={__("Show Labels", "wp-components")}
            checked={showLabels}
            onChange={(value) => setAttributes({ showLabels: value })}
          />
        </PanelBody>

        <PanelBody title={__("Networks", "wp-components")} initialOpen={true}>
          {AVAILABLE_NETWORKS.map((network) => (
            <CheckboxControl
              key={network.value}
              label={network.label}
              checked={networks.includes(network.value)}
              onChange={() => toggleNetwork(network.value)}
            />
          ))}
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <ul className="atom-share-list">
          {networks.map((network) => {
            const networkData = AVAILABLE_NETWORKS.find((n) => n.value === network);
            if (!networkData) return null;
            return (
              <li key={network} className={`atom-share-${network}`}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <i className={networkData.icon} />
                  {showLabels && <span>{networkData.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Edit;
