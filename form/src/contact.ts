class OliverFlintAddressLookup {
    static OnLoad(executionContext: any) {
        const formContext = executionContext.getFormContext();
        window.parent.addEventListener("onReceiveAddress", (ev: CustomEvent<EventData>) => {
            if(ev.detail) {
                if(ev.detail.Attribute === "address1_postalcode"){
                    const address = ev.detail.Address;
                    formContext.getAttribute("address1_line1").setValue(address.line_1);
                    formContext.getAttribute("address1_line2").setValue(address.line_2);
                    formContext.getAttribute("address1_line3").setValue(address.line_3);
                    formContext.getAttribute("address1_city").setValue(address.town_or_city);
                    formContext.getAttribute("address1_county").setValue(address.county);
                    formContext.getAttribute("address1_country").setValue(address.country);
                }
                if(ev.detail.Attribute === "address2_postalcode"){
                    const address = ev.detail.Address;
                    formContext.getAttribute("address2_line1").setValue(address.line_1);
                    formContext.getAttribute("address2_line2").setValue(address.line_2);
                    formContext.getAttribute("address2_line3").setValue(address.line_3);
                    formContext.getAttribute("address2_city").setValue(address.town_or_city);
                    formContext.getAttribute("address2_county").setValue(address.county);
                    formContext.getAttribute("address2_country").setValue(address.country);
                }
                if(ev.detail.Attribute === "address3_postalcode"){
                    const address = ev.detail.Address;
                    formContext.getAttribute("address3_line1").setValue(address.line_1);
                    formContext.getAttribute("address3_line2").setValue(address.line_2);
                    formContext.getAttribute("address3_line3").setValue(address.line_3);
                    formContext.getAttribute("address3_city").setValue(address.town_or_city);
                    formContext.getAttribute("address3_county").setValue(address.county);
                    formContext.getAttribute("address3_country").setValue(address.country);
                }
            }
        });
    }
}

interface EventData {
    Address: any,
    Attribute: string
}