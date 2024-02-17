import json
import xml.etree.ElementTree as ET

def json_to_fhir_xml(json_data):
    # Parse the JSON data
    fhir_data = json.loads(json_data)
    
    # Create the root XML element, assuming 'Resource' is the root type
    root = ET.Element('Resource')
    
    def add_elements(parent, data):
        if isinstance(data, dict):
            for key, value in data.items():
                # Special handling for attributes (e.g., id, value) to conform with FHIR XML format
                if key in ['id', 'value']:
                    parent.set(key, str(value))
                else:
                    child = ET.SubElement(parent, key)
                    add_elements(child, value)
        elif isinstance(data, list):
            for item in data:
                # Assuming each item in the list is a complex object
                child = ET.Element('element')  # Use appropriate tag based on FHIR spec
                parent.append(child)
                add_elements(child, item)
        else:
            parent.text = str(data)
    
    # Build the XML structure from JSON
    add_elements(root, fhir_data)
    
    # Convert the XML structure to a string
    xml_str = ET.tostring(root, encoding='unicode')
    return xml_str

# Example JSON FHIR data
json_fhir_data = '{"resourceType": "Patient", "id": "example", "text": {"status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">John Doe</div>"}}'

# Convert and print the XML
xml_fhir_data = json_to_fhir_xml(json_fhir_data)
print(xml_fhir_data)
