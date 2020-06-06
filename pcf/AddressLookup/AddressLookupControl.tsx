import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import { TextField, IconButton, ComboBox, IComboBoxOption, IComboBox } from '@fluentui/react';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

export interface IAddressLookupControlProps {
    context: ComponentFramework.Context<IInputs>
    postcode_onChange: (newValue: string) => void
}

export interface IAddressLookupControlState {
    results: IComboBoxOption[],
    postcode: string | undefined,
    addresslistHidden: boolean
}

interface EventData {
    Address: any,
    Attribute: string
}

export class AddressLookupControl extends React.Component<IAddressLookupControlProps, IAddressLookupControlState> {
    constructor(props: IAddressLookupControlProps) {
        super(props);
        this.state = {
            results: [],
            postcode: (props.context.parameters.postalcode.raw ? props.context.parameters.postalcode.raw : undefined),
            addresslistHidden: true
        }
    }

    public postcodeTextField_onChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string | undefined) {
        let val = newValue?.toUpperCase() || "";
        this.props.postcode_onChange(val);
        this.setState({
            postcode: val
        });
    }

    public searchButton_onClick(event: React.MouseEvent<HTMLButtonElement>) {
        let url = "https://api.getAddress.io/find/" + this.state.postcode + "?api-key=" + this.props.context.parameters.apikey.raw + "&expand=true";
        fetch(url, {
            mode: "cors",
            method: "GET",
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to retrieve address data. " + response.statusText);
                }
            })
            .then((data: any) => {
                let _addressResults: IComboBoxOption[] = [];
                data.addresses.forEach((adrs: any, index: number) => {
                    let o: IComboBoxOption;
                    o = {
                        text: adrs.formatted_address.join(","),
                        key: index,
                        data: JSON.stringify(adrs)
                    };
                    _addressResults.push(o);
                });
                this.setState({
                    results: _addressResults,
                    addresslistHidden: false,
                    postcode: data.postcode
                });
            })
            .catch((error: Error) => {
                console.error("Error:", error);
                this.props.context.navigation.openErrorDialog({ message: error.message, details: error.stack });
            });
    }

    public addresslistComboBox_onChange(event: React.FormEvent<IComboBox>, option?: IComboBoxOption | undefined, index?: number | undefined, value?: string | undefined): void {
        const selectedAddress = JSON.parse(option?.data);
        const attributeName = this.props.context.parameters.postalcode.attributes?.LogicalName;
        const customEvent = new CustomEvent("onReceiveAddress", {
            detail: {
                Address: selectedAddress,
                Attribute: attributeName
            }
        } as CustomEventInit<EventData>);
        window.dispatchEvent(customEvent);
        this.setState({
            addresslistHidden: true
        });
    }

    render(): JSX.Element {
        const { postcode, addresslistHidden, results } = this.state;
        return (
            <div className="maincontainer">
                <div className="searchcontainer">
                    <div className="textfieldcontainer">
                        <TextField
                            id="postcodeTextField"
                            value={postcode}
                            placeholder="---"
                            onChange={this.postcodeTextField_onChange.bind(this)}
                            className="textfield"
                            borderless
                        ></TextField>
                    </div>
                    <div className="searchbuttoncontainer">
                        <IconButton
                            id="searchButton"
                            iconProps={{ iconName: "Search" }}
                            onClick={this.searchButton_onClick.bind(this)}
                        ></IconButton>
                    </div>
                </div>
                <div className="addresslistcontainer" hidden={addresslistHidden}>
                    <ComboBox
                        id="addresslistComboBox"
                        className="addresslist"
                        hidden={addresslistHidden}
                        options={results}
                        onChange={this.addresslistComboBox_onChange.bind(this)}
                        placeholder="Select Address..."
                    >
                    </ComboBox>
                </div>
            </div>
        );
    }
}